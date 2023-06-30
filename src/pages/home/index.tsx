/* eslint-disable prefer-const */
import { Container } from "../../components/container";
import { AiOutlineSearch } from "react-icons/ai";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  km: string;
  city: string;
  images: CarImageProps[];
}
export interface CarImageProps {
  name: string;
  uuid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));
    getDocs(queryRef).then((snapshot) => {
      let listCars = [] as CarProps[];

      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          uid: doc.data().uid,
          city: doc.data().city,
          images: doc.data().images,
          km: doc.data().km,
          name: doc.data().name,
          price: doc.data().price,
          year: doc.data().year,
        });
      });
      setCars(listCars);
      console.log(cars);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImgLoad) => [...prevImgLoad, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      return;
    }
    setCars([]);
    setLoadImages([]);
    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    let listSearch = [] as CarProps[];
    querySnapshot.forEach((doc) => {
      listSearch.push({
        id: doc.id,
        uid: doc.data().uid,
        city: doc.data().city,
        images: doc.data().images,
        km: doc.data().km,
        name: doc.data().name,
        price: doc.data().price,
        year: doc.data().year,
      });
    });
    setCars(listSearch);
  }

  return (
    <Container>
      <section className=" drop-shadow-md p-4 rounded-lg w-full bg-white max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="border-2 w-full border-1 rounded-lg h-11 px-3 outline-none"
          placeholder="Digite o nome do carro"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSearchCar}
          className="bg-red-500 h-11 px-8 rounded-lg"
        >
          <AiOutlineSearch size={20} cursor={"pointer"} color={"#fff"} />
        </button>
      </section>
      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg drop-shadow-md">
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={car.images[0].url}
                alt="carro"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2">
                {car.name.toUpperCase()}
              </p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6 ">
                  Ano: {car.year} | {car.km} KMs rodados
                </span>
                <strong className=" text-black font-medium text-xl">
                  R${" "}
                  {car.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>
              <hr className="h-px bg-slate-200 my-2 " />
              <div className="px-2 pb-2">
                <span className="text-black">{car.city.toUpperCase()}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
