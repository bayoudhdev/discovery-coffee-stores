import {useRouter} from 'next/router'
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import {fetchCoffeeStores} from "../../lib/coffee-stores";
import {useAppContext} from "../../store/store-context";
import {useEffect, useState} from "react";
import {isEmpty} from "../../utils/index";
import useSWR from "swr"
import ReactStars from "react-stars/dist/react-stars";

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map(coffee => {
        return {
            params: {
                id: coffee.id.toString()
            }
        }
    });
    return {paths, fallback: true};
}

export async function getStaticProps(staticParams) {
    const params = staticParams.params;
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoresById = coffeeStores.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id;
    });
    return {props: {coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {}},}
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {})
    const {state: {coffeeStores}} = useAppContext();
    const handleCreateCoffeeStore = async (coffeeStore) => {
        const {id, name, address, neighborhood, imgUrl} = coffeeStore;
        await fetch('/api/createCoffeeStore', {
            method: 'POST', headers: {
                'Content-Type': "application/json"
            }, body: JSON.stringify({
                id: `${id}`, name, address: address || "", neighborhood: neighborhood || "", imgUrl
            })
        });
    };
    useEffect(() => {
        const handleCoffeeStore = async () => {
            if (isEmpty(initialProps.coffeeStore)) {
                if (coffeeStores.length > 0) {
                    const coffeeStoreFromContext = coffeeStores.find(coffeeStore => {
                        return coffeeStore.id.toString() === id;
                    });
                    if (coffeeStoreFromContext) {
                        setCoffeeStore(coffeeStoreFromContext);
                        await handleCreateCoffeeStore(coffeeStoreFromContext);
                    }
                }
            } else {
                await handleCreateCoffeeStore(initialProps.coffeeStore)
            }
        };
        handleCoffeeStore();
    }, [id, initialProps, initialProps.coffeeStore, coffeeStores])
    const {
        address = "",
        name = "",
        neighborhood = "",
        imgUrl = "",
    } = coffeeStore;
    const [votingCount, setVotingCount] = useState(0);
    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, (url) => fetch(url).then((res) => res.json()));
    useEffect(() => {
        if (data && data.length > 0) {
            const coffee = data[0];
            setCoffeeStore(coffee)
            setVotingCount(coffee.voting)
        }
    }, [data])

    if (router.isFallback) {
        return <div>Loading ...</div>
    }
    const handleUpVoteButton = async (voting) => {
        const response = await fetch('/api/favouriteCoffeeStoreById', {
            method: 'PUT', headers: {
                'Content-Type': "application/json"
            }, body: JSON.stringify({
                id,
                voting
            })
        });
        const updatedVoting = await response.json();
        if (updatedVoting && updatedVoting.length > 0) {
            setVotingCount(updatedVoting[0].voting);
        }
    }

    if (error) {
        return <div>Something went wrong retrieving coffee store</div>
    }
    return (<div className={styles.layout}>
        <Head><title>{name}</title></Head>
        <div className={styles.container}>
            <div className={styles.col1}>
                <Link href={'/'} className={styles.backToHomeLink}>← Back to home</Link>
                <div className={styles.nameWrapper}><h1 className={styles.name}>{name}</h1></div>
                <Image
                    className={styles.storeImg}
                    src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                    width={600}
                    height={360}
                    alt={`${name}`}
                />
            </div>
            <div className={cls("glass", styles.col2)}>
                {address && (<div className={styles.iconWrapper}>
                    <Image
                        src="/static/icons/places.svg"
                        width="24"
                        height="24"
                        alt="place"
                    />
                    <p className={styles.text}>{address}</p>
                </div>)}
                {neighborhood && (<div className={styles.iconWrapper}>
                    <Image
                        src="/static/icons/nearMe.svg"
                        width="24"
                        height="24"
                        alt="nearMe"
                    />
                    <p className={styles.text}>{neighborhood}</p>
                </div>)}
                <div className={styles.iconWrapper}>
                    <ReactStars
                        count={5}
                        size={24}
                        half={false}
                        onChange={handleUpVoteButton}
                        value={votingCount}
                        color2={'#ffd700'}/>
                </div>
            </div>
        </div>
    </div>);
}

export default CoffeeStore;