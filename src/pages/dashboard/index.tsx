/* eslint-disable prefer-const */
import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container";
import { PanelHeader } from "../../components/panelHeader";
import { FiTrash2 } from "react-icons/fi";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { CarProps } from "../home";
import { AuthContext } from "../../context/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-hot-toast";

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        return;
      }
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uuid", "==", user.uid));
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
    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarProps) {
    const itemCar = car;

    const docRef = doc(db, "cars", itemCar.id);
    await deleteDoc(docRef);
    itemCar.images.map(async (img) => {
      const imagePath = `images/${img.uuid}/${img.name}`;
      const imageRef = ref(storage, imagePath);
      try {
        await deleteObject(imageRef);
        toast.success("Item deletado com sucesso");
        setCars(cars.filter((car) => car.id !== itemCar.id));
      } catch (err) {
        toast.error("Houve um erro ao deletar a imagem");
        console.log(err, "erro ao deletar");
      }
    });
  }

  return (
    <Container>
      <PanelHeader />
      <main className=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section
            key={car.id}
            className="w-full bg-white rounded-lg relative drop-shadow-md"
          >
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute  bg-white w-14 h-14 rounded-full drop-shadow-md flex items-center justify-center right-2 top-2 transition-all active:scale-95"
            >
              <FiTrash2 size={26} color={"red"} />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70 "
              src={car.images[0].url}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name.toUpperCase()}</p>
            <div className=" flex flex-col px-2">
              <span className="text-zinc-700">
                Ano: {car.year} | {car.km}km
              </span>
              <strong className="text-black font-bold mt-4">
                R$ {car.price}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city.toUpperCase()}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
