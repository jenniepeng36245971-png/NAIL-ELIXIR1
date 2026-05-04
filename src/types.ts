export enum SimulationModule {
  DOWNFORCE = 'DOWNFORCE',
  THERMAL = 'THERMAL',
  IMPACT = 'IMPACT',
}

export interface SimulationState {
  module: SimulationModule;
  isTransparent: boolean;
  // Module 1: Downforce
  force: number; // N
  area: number; // cm^2
  // Module 2: Thermal
  tempDelta: number; // K
  exposureTime: number; // hrs
  // Module 3: Impact
  mass: number; // kg
  height: number; // m
  impactTime: number; // s
}

export const INITIAL_STATE: SimulationState = {
  module: SimulationModule.DOWNFORCE,
  isTransparent: false,
  force: 50,
  area: 10,
  tempDelta: 20,
  exposureTime: 0,
  mass: 1.2,
  height: 0.5,
  impactTime: 0.01,
};

export const COLORS = {
  roseGold: '#B76E79',
  pureWhite: '#FFFFFF',
  lightBlue: '#F0F8FF',
  uvBlue: '#4D4DFF',
};
