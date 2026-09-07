import React from "react";

interface ProductCardProps {
  produto: string;
  quantidade: number;
  imagem?: string;
  onSelect?: () => void;
}

export default function ProductCard({ produto, quantidade, imagem, onSelect }: ProductCardProps) {
  // Define uma imagem padrão (placeholder) se a propriedade vier vazia
  const imageSource = imagem && imagem.trim() !== "" 
    ? imagem 
    : "/placeholder.png";

  return (
    <div 
      onClick={onSelect}
      className="bg-[#2d2538] text-white p-4 rounded-2xl flex flex-col items-center w-44 cursor-pointer hover:bg-[#3b304a] transition-all shadow-md"
    >
      <div className="w-24 h-24 mb-3 overflow-hidden rounded-xl bg-gray-700 flex items-center justify-center">
        <img 
          src={imageSource} 
          alt={produto} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      </div>

      <h3 className="font-bold text-center text-sm mb-1">{produto}</h3>
      <span className="text-xs text-gray-300">
        Disponível: {quantidade}
      </span>
    </div>
  );
}
