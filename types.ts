export type Restaurants = {
  id: string;
  name: string;
  image: string;
  address: string;
  opening: string;
  closing: string;
};
export type CarouselImage = {
  imageUrl: string;
  title?: string;
  [key: string]: any;
};

const carouselImages: CarouselImage[] = [];
export type CarouselData = {
  images: string[];
};

export type SlotData = {
  slot: string[];
};

export type CarouselItemProps = {
  item: string;
};
