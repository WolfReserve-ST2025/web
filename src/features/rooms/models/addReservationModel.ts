export interface AddReservationModel {
    personCount: number;
    reservedDateFrom?: Date;
    reservedDateTo?: Date;
    roomId: string;
    isAccepted?: boolean;
    isReserved?: boolean;
}