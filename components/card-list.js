import styles from "../styles/card-list-module.css";
import Card from "../components/card";

export const CardList = (props) => {
    return (<div className={styles.sectionWrapper}>
        <h2 className={styles.heading2}>Stores near me</h2>
        <div className={styles.cardLayout}>
            {props.coffeeStores.map(coffeeStore => {
                return <Card
                    key={coffeeStore.id}
                    className={styles.card}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                    neighborhood={coffeeStore.neighborhood}
                    href={`/coffee-store/${coffeeStore.id}`}
                />
            })}
        </div>
    </div>);
}