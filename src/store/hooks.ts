// src/store/hooks.ts

import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof import('@/store/store').store>();
