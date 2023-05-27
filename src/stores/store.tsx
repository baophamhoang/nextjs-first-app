import { redux, devtools } from 'zustand/middleware'
import { create } from 'zustand';
import { reducer, initialState } from './reducer';

export const useReduxStore = create(devtools(redux(reducer, initialState)))