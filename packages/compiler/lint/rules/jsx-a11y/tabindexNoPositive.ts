import {Path, createVisitor, signals} from "@romefrontend/compiler";
import {descriptions} from "@romefrontend/diagnostics";
import {getJSXAttribute, hasJSXAttribute} from "@romefrontend/js-ast-utils";
import {JSXAttribute, JSXElement} from "@romefrontend/ast";

function createDiagnostic(path: Path, node: JSXElement, attribute: JSXAttribute) {
	return path.addFixableDiagnostic(
		{
			target: attribute,
			fixed: signals.replace({
				...node,
				attributes: node.attributes.filter((attribute) =>
					attribute.type !== "JSXAttribute" ||
					attribute.name.name !== "tabIndex"
				),
			}),
		},
		descriptions.LINT.JSX_A11Y_TABINDEX_NO_POSITIVE,
	);
}

export default createVisitor({
	name: "jsx-a11y/tabindexNoPositive",
	enter(path) {
		const {node} = path;

		if (node.type === "JSXElement" && hasJSXAttribute(node, "tabIndex")) {
			const attribute = getJSXAttribute(node, "tabIndex");
			if (
				attribute &&
				attribute.value &&
				attribute.value.type === "JSStringLiteral"
			) {
				const tabIndexValue = attribute.value.value;
				if (Number(tabIndexValue) > 0) {
					createDiagnostic(path, node, attribute);
				}
			}

			if (
				attribute &&
				attribute.value &&
				attribute.value.type === "JSXExpressionContainer"
			) {
				const expression = attribute.value.expression;
				if (
					expression.type === "JSNumericLiteral" ||
					expression.type === "JSStringLiteral"
				) {
					const tabIndexValue = expression.value;
					if (Number(tabIndexValue) > 0) {
						createDiagnostic(path, node, attribute);
					}
				}
			}
		}
		return signals.retain;
	},
});
