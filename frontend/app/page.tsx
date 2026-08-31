import Product from "@/components/Product";
import Footer from "@/components/Footer";

interface Props {
    title: string;
    description: string;
}

export default function Home() {
  const doces: Props[] = [
    { 
      title: "Mousse",
      description: "bom dms zé"
    },
    { 
      title: "Mousse",
      description: "bom dms zé"
    },
    { 
      title: "Mousse",
      description: "bom dms zé"
    },
    { 
      title: "Mousse",
      description: "bom dms zé"
    },
    { 
      title: "Mousse",
      description: "bom dms zé"
    },
  ]

  return (
    <>
      <main>
        <h1 className="text-white font-bold text-2xl my-5 ml-5">Conheça nossos doces!</h1>

        <section className="space-y-5 px-5">
          { doces.map((item, key) => (
            <Product key={key} title={item.title} description={item.description} />
          )) }
        </section>
      </main>
      <Footer />
    </>
  );
}
