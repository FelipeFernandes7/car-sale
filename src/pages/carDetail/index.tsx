import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Swiper, SwiperSlide } from "swiper/react";

export interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  km: string;
  city: string;
  model: string;
  created: string;
  owner: string;
  description: string;
  whatsapp: string;
  images: CarImageProps[];
}
export interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function CarDetail() {
  const [car, setCar] = useState<CarProps>();
  const [sliderPreview, setSliderPreview] = useState<number>(2);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function loadCar() {
      if (!id) return;
      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          description: snapshot.data()?.description,
          city: snapshot.data()?.city,
          created: snapshot.data()?.created,
          images: snapshot.data()?.images,
          km: snapshot.data()?.km,
          model: snapshot.data()?.model,
          owner: snapshot.data()?.owner,
          price: snapshot.data()?.price,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
        });
      });
    }
    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true, enabled: true }}
          navigation
        >
          {car?.images.map((img) => (
            <SwiperSlide key={img.name}>
              <img
                className="w-full h-96 object-cover rounded-lg"
                src={img.url}
                alt="Carros"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4 drop-shadow-md">
          <div className=" flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">
              {car?.name.toUpperCase()}
            </h1>
            <h1 className="font-bold text-3xl text-black">R${car?.price}</h1>
          </div>
          <p>{car?.model}</p>
          <div className="flex w-full gap-6 my-4">
            <div className=" flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city.toUpperCase()}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>
            <div className=" flex flex-col gap-4">
              <div>
                <p>Km</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description.toUpperCase()}</p>
          <strong>Telefone/Whatsapp</strong>
          <p>{car?.whatsapp}</p>
          <a
            className=" transition-all active:scale-95 bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-12 text-xl rounded-lg font-medium cursor-pointer"
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá como vocês está? ${car?.owner}`}
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color={"#fff"} />
          </a>
        </main>
      )}
    </Container>
  );
}
