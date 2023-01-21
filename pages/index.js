import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Banner from "../components/banner";
import {fetchCoffeeStores} from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import {useEffect, useState} from "react";
import {CardList} from "../components/card-list";
import {HeroImage} from "../components/hero-image";
import {ACTION_TYPES, useAppContext} from "../store/store-context"

export async function getStaticProps() {
    const coffeeStores = await fetchCoffeeStores();
    return {
        props: {coffeeStores}, // will be passed to the page component as props
    }
}

export default function Home(props) {
    const {handleTrackLocation, locationErrorMsg, locationLoading} = useTrackLocation();
    const [coffeeStoresError, setCoffeeStoresError] = useState(null);
    const {dispatch, state} = useAppContext()
    const {coffeeStores, latLong} = state;

    useEffect(() => {
        async function setCoffeeStoresByLocation() {
            if (latLong) {
                try {
                    const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
                    const coffeeStores = await response.json();
                    dispatch({
                        type: ACTION_TYPES.SET_COFFEE_STORES,
                        payload: {
                            coffeeStores: coffeeStores
                        }
                    });
                    setCoffeeStoresError("")
                    //set coffee stores
                } catch (error) {
                    //set error
                    setCoffeeStoresError(error.message);
                }
            }
        };
        setCoffeeStoresByLocation();
    }, [latLong, dispatch]);

    const handleOnBannerBtnClick = () => handleTrackLocation();

    return (<div className={styles.container}>
        <Head>
            <title>Create Next App</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <main className={styles.main}>
            <Banner buttonText={locationLoading ? "Loading..." : "View stores nearby"}
                    handleOnClick={handleOnBannerBtnClick}/>
            {locationErrorMsg && <p>Something went wrong : {locationErrorMsg}</p>}
            {coffeeStoresError && <p>Something went wrong : {coffeeStoresError}</p>}
            <HeroImage/>
            {coffeeStores.length > 0 && (<CardList coffeeStores={coffeeStores} nameSection="Stores near me"/>)}
            {props.coffeeStores.length > 0 && (<CardList coffeeStores={props.coffeeStores} nameSection="Toronto"/>)}
        </main>
    </div>)
}
