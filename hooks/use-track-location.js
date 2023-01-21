import {useState} from "react";
import {ACTION_TYPES, useAppContext} from "../store/store-context"

const useTrackLocation = () => {
    const [locationErrorMsg, setLocationErrorMsg] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);
    const {dispatch} = useAppContext()

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch({
            type: ACTION_TYPES.SET_LAT_LONG,
            payload : {latLong: `${latitude},${longitude}`}

        });
        setLocationErrorMsg("");
        setLocationLoading(false);
    }
    const error = (error) => {
        setLocationErrorMsg(`Enabled to retrieve your location := ${error}`);
        setLocationLoading(false);
    }

    const handleTrackLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            setLocationLoading(false);
            setLocationErrorMsg("Geolocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
    return {
        locationErrorMsg: locationErrorMsg, locationLoading: locationLoading, handleTrackLocation,
    };
}

export default useTrackLocation;