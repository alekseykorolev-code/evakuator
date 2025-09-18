export type RequestStatus = 'отправлена' | 'в обработке' | 'завершена' | 'отменена';

export type TowRequest = {
  id: string;
  createdAt: number;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  dropoffAddress: string;
  comment?: string;
  photos: string[]; // file URIs
  status: RequestStatus;
};

export type UserProfile = {
  phone: string;
  name?: string;
};

