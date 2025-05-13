export class Room {
    _id: string;
    name: string;
    type: string;
    description: string;
    pricePerNight: number;
    maxPersonCount: number;
    imgUrl: string;
    userId: string;

    constructor({ _id, name, type, description, pricePerNight, maxPersonCount, imgUrl, userId }: 
        { _id: string; name: string; type: string; description: string; pricePerNight: number; maxPersonCount: number; imgUrl: string; userId: string; }) {
        this._id = _id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.pricePerNight = pricePerNight;
        this.maxPersonCount = maxPersonCount;
        this.imgUrl = imgUrl;
        this.userId = userId;
    };

    static fromApi(apiData: any): Room {
        return new Room({
            _id: apiData._id,
            name: apiData.name,
            type: apiData.type,
            description: apiData.description,
            pricePerNight: apiData.pricePerNight,
            maxPersonCount: apiData.maxPersonCount,
            imgUrl: apiData.imgUrl,
            userId: apiData.userId,
        });
    };
    static fromApiList(apiData: any[]): Room[] {
        return apiData.map((room) => Room.fromApi(room));
    };       
}
