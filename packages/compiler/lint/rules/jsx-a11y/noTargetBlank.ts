import {descriptions} from "@romefrontend/diagnostics";
import {AnyNode} from "@romefrontend/ast";
import {createVisitor, signals} from "@romefrontend/compiler";
import {getJSXAttribute, isJSXElement} from "@romefrontend/js-ast-utils";

function jsxAnchorHasBlankTarget(node: AnyNode) {
	return (
		isJSXElement(node, "a") &&
		node.attributes.some((attribute) =>
			attribute.type === "JSXAttribute" &&
			attribute.name.name === "target" &&
			attribute.value &&
			attribute.value.type === "JSStringLiteral" &&
			attribute.value.value === "_blank"
		)
	);
}

function jsxAnchorHasNoReferrer(node: AnyNode) {
	return (
		isJSXElement(node, "a") &&
		node.attributes.some((attribute) =>
			attribute.type === "JSXAttribute" &&
			attribute.name.name === "rel" &&
			attribute.value &&
			attribute.value.type === "JSStringLiteral" &&
			attribute.value.value.includes("noreferrer")
		)
	);
}

function jsxAnchorHasExternalLink(node: AnyNode) {
	return (
		isJSXElement(node, "a") &&
		node.attributes.some((attribute) =>
			attribute.type === "JSXAttribute" &&
			attribute.name.name === "href" &&
			attribute.value &&
			((attribute.value.type === "JSStringLiteral" &&
			/^(?:\w+:|\/\/)/.test(attribute.value.value)) ||
			attribute.value.type === "JSXExpressionContainer")
		)
	);
}

export default createVisitor({
	name: "jsx-a11y/noTargetBlank",

	enter(path) {
		const {node} = path;

		if (
			node.type === "JSXElement" &&
			jsxAnchorHasBlankTarget(node) &&
			!jsxAnchorHasNoReferrer(node) &&
			jsxAnchorHasExternalLink(node)
		) {
			return path.addFixableDiagnostic(
				{
					target: getJSXAttribute(node, "target"),
					fixed: signals.replace({
						...node,
						attributes: node.attributes.filter((attribute) =>
							attribute.type !== "JSXAttribute" ||
							attribute.name.name !== "target"
						),
					}),
				},
				descriptions.LINT.JSX_A11Y_NO_TARGET_BLANK,
			);
		}

		return signals.retain;
	},
});
