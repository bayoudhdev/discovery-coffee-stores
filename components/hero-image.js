import styles from "../styles/Home.module.css";
import Image from "next/image";

export const HeroImage = () => {
    return (<div className={styles.heroImage}>
        <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Hero image"
            priority
        />
    </div>);
}