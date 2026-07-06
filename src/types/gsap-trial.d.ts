declare module "gsap-trial/SplitText" {
  import { Plugin } from "gsap";
  export class SplitText {
    constructor(targets: gsap.TweenTarget, vars?: any);
    public chars: HTMLElement[];
    public words: HTMLElement[];
    public lines: HTMLElement[];
    public revert(): void;
  }
  export const SplitTextPlugin: Plugin;
  export default SplitText;
}
