import styles from "../styles/card.module.css"
import Image from "next/image";
import Link from "next/link";
import cls from 'classnames';

const Card = (props) => {
    return <Link className={styles.cardLink} href={props.href}>
        <div className={cls("glass", styles.container)}>
            <div className={styles.cardHeaderWrapper}>
                <h2 className={styles.cardHeader}>{props.name}</h2>
            </div>
            <div className={styles.cardImageWrapper}>
                <Image
                    className={styles.cardImage}
                    src={props.imgUrl}
                    width={250}
                    height={160}
                    alt="coffee store image"
                />
            </div>
        </div>
    </Link>;
}

export default Card;