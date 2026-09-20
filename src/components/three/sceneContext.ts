"use client";

import { createContext, useContext } from "react";

/** True only while the scene's section is actually on screen. Scenes stop their render loop when false. */
export const SceneRunContext = createContext(true);
export const useSceneRunning = () => useContext(SceneRunContext);
