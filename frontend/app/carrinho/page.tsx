import Product from "@/components/Product";

interface Props {
    title: string;
    description: string;
}

export default function Carrinho() {
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
      <section>
        <h1 className="text-white font-bold text-2xl my-5 ml-5 text-center">Meu carrinho</h1>

        <section className="space-y-5 px-5 flex flex-wrap justify-around">
          { doces.map((item, key) => (
            <Product key={key} title={item.title} description={item.description} />
          )) }
        </section>
      </section>
  );
}
