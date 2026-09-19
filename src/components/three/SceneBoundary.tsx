"use client";

import { Component, type ReactNode } from "react";

/** WebGL can fail (blocked, no GPU). The page must stay fully usable without it. */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
