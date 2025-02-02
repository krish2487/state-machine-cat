import type { ITransition } from "types/state-machine-cat.js";
import type { IExtendedTransition } from "./extended-types.js";
import utl from "./utl.mjs";

function escapeTransitionStrings(pTransition: ITransition): ITransition {
  const lTransition = { ...pTransition };

  if (lTransition.note) {
    lTransition.note = lTransition.note.map(utl.escapeString);
  }
  if (lTransition.label) {
    lTransition.label = utl.escapeLabelString(lTransition.label);
  }
  return lTransition;
}

function addPorts(pDirection: string) {
  return (pTransition: IExtendedTransition): IExtendedTransition => {
    let lAdditionalAttributes = {};

    if (pTransition.isCompositeSelf) {
      if (utl.isVertical(pDirection)) {
        lAdditionalAttributes = {
          tailportflags: `tailport="e" headport="e"`,
          headportflags: `tailport="w"`,
        };
      } else if (pTransition.hasParent) {
        lAdditionalAttributes = {
          tailportflags: `tailport="n" headport="n"`,
          headportflags: `tailport="s"`,
        };
      } else {
        lAdditionalAttributes = {
          tailportflags: `tailport="s" headport="s"`,
          headportflags: `tailport="n"`,
        };
      }
    }
    return { ...pTransition, ...lAdditionalAttributes };
  };
}

function classifyTransition(pTransition: ITransition): ITransition {
  const lClasses = ["transition"];
  if (pTransition.type) {
    lClasses.push(pTransition.type);
  }
  if (pTransition.class) {
    lClasses.push(pTransition.class.trim().replace(/[ ]{2,}/g, " "));
  }

  pTransition.class = lClasses.join(" ");
  return pTransition;
}

export default { escapeTransitionStrings, addPorts, classifyTransition };
