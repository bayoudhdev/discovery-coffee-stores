import {createApi} from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_KEY,
});

export const getUrlCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_SECRET_ID}&limit=${limit}`;
}

export const getUrlUnsplashImage = async () => {
    const photos = await unsplash.search.getPhotos({
        query: "Coffee shop", page: 1, perPage: 40,
    })
    return photos.response.results.map(result => result.urls["small"]);
}

export const fetchCoffeeStores = async (latLong = "39.052018,-77.454899", limit= 6) => {
    const photos = await getUrlUnsplashImage();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(getUrlCoffeeStores(latLong, "coffee stores", limit), options);
    const data = await response.json();
    return data.results.map((result, index) => {
        const neighborhood = result.location.neighborhood;
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighborhood: neighborhood?.length > 0 ? neighborhood[0] : "",
            imgUrl: photos.length > 0 ? photos[index].toString() : "",
        }
    });
    // .catch(err => console.error(err));
}