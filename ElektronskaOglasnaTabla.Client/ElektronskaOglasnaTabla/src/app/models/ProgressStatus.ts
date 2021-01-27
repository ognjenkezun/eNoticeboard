import { ProgressStatusEnum } from './ProgressStatusEnum';

export interface ProgressStatus {
    status: ProgressStatusEnum;
    percentage?: number;
}