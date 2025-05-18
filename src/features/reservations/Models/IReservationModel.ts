export interface IReservationModel {
    id: string;
    personCount: number;
    totalPrice: number;
    reservedDateFrom?: Date;
    reservedDateTo?: Date;
    roomId: string;
    roomName: string;
    userid: string;
    hotelName: string;
    isAccepted?: boolean;
    isReserved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}