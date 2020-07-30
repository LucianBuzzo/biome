/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {JSXIdentifier, NodeBaseWithComments} from "@romefrontend/ast";
import {createBuilder} from "../../utils";

export interface JSXNamespacedName extends NodeBaseWithComments {
	readonly type: "JSXNamespacedName";
	readonly namespace: JSXIdentifier;
	readonly name: JSXIdentifier;
}

export const jsxNamespacedName = createBuilder<JSXNamespacedName>(
	"JSXNamespacedName",
	{
		bindingKeys: {},
		visitorKeys: {
			namespace: true,
			name: true,
		},
	},
);
