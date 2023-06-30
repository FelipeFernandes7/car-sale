import { Container } from "../../../components/container";
import { PanelHeader } from "../../../components/panelHeader";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/input";
import { z } from "zod";
import { CSSProperties, ChangeEvent, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../../../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { HashLoader } from "react-spinners";
const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O model é obrigatório"),
  year: z.string().nonempty("O campo ano do carro é obrigatório"),
  km: z.string().nonempty("O Km do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("O campo cidade é obrigatório"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().nonempty("A descrição é obrigatória!"),
});
type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uuid: string;
  name: string;
  previewUrl: string;
  url: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export function New() {
  const { user } = useContext(AuthContext);
  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(formData: FormData) {
    if (carImages.length === 0) {
      toast.error("Upload da imagem obrigatório!", {
        iconTheme: { primary: "white", secondary: "red" },
        style: { backgroundColor: "red", color: "#fff" },
      });
      return;
    }
    const carListImages = carImages.map((car) => {
      return {
        uuid: car.uuid,
        name: car.name,
        url: car.url,
      };
    });
    addDoc(collection(db, "cars"), {
      name: formData.name.toUpperCase(),
      model: formData.model,
      city: formData.city.toUpperCase(),
      year: formData.year,
      km: formData.km,
      price: formData.price,
      description: formData.description,
      whatsapp: formData.whatsapp,
      created: new Date(),
      owner: user?.name,
      uuid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        setIsLoading(true);
        toast.success("Cadastro realizado com sucesso!");
        reset();
        setCarImages([]);
        setIsLoading(false);
      })
      .catch((errors) => {
        console.log(errors.message);
        toast.error("erro ao cadastrar no banco");
      });
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        toast.error("Envie uma imagem jpeg ou png", {
          iconTheme: { primary: "white", secondary: "red " },
          style: { backgroundColor: "red", color: "white" },
        });
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }
    const currentUid = user?.uid;
    const uuidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uuidImage}`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uuidImage,
          uuid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setCarImages((img) => [...img, imageItem]);
      });
    });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uuid}/${item.name}`;
    const imageRef = ref(storage, imagePath);
    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((img) => img.url !== item.url));
    } catch (error) {
      toast.error("Erro ao deletar");
    }
  }

  return (
    <Container>
      <PanelHeader />
      <div className=" drop-shadow-md w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button
          className="bg-slate-100 border-2 border-dashed 
        w-48 rounded-lg flex items-center justify-center 
        cursor-pointer border-gray-600 h-32 md:w-48 
         transition-all active:scale-95"
        >
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer ">
            <input
              className="opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>
        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              onClick={() => handleDeleteImage(item)}
              className="absolute"
            >
              {<FiTrash size={28} color={"#fff"} />}
            </button>
            <img
              className="rounded-lg w-full h-32 object-cover"
              src={item.previewUrl}
              alt="Imagem do carro"
            />
          </div>
        ))}
      </div>
      <div className="drop-shadow-md w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type={"text"}
              placeholder={"Digite o nome do carro"}
              name={"name"}
              register={register}
              errors={errors.name?.message}
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type={"text"}
              placeholder={"Digite o modelo do carro"}
              name={"model"}
              register={register}
              errors={errors.model?.message}
            />
          </div>
          <div className="w-full mb-3 flex flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano do carro</p>
              <Input
                type={"text"}
                placeholder={"Ex: 2016/2016"}
                name={"year"}
                register={register}
                errors={errors.year?.message}
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Km rodados</p>
              <Input
                type={"text"}
                placeholder={"Ex: 23.000..."}
                name={"km"}
                register={register}
                errors={errors.km?.message}
              />
            </div>
          </div>
          <div className="w-full mb-3 flex flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone para contato</p>
              <Input
                type={"text"}
                placeholder={"Ex: 169934-0302"}
                name={"whatsapp"}
                register={register}
                errors={errors.whatsapp?.message}
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type={"text"}
                placeholder={"Ex: Joinville - SC"}
                name={"city"}
                register={register}
                errors={errors.city?.message}
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type={"text"}
              placeholder={"Ex: R$200.000,00"}
              name={"price"}
              register={register}
              errors={errors.price?.message}
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-32 outline-none pt-2 px-4"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Informe a descrição do carro"
            />
            {errors.description && (
              <p className="mt-1 text-red-500">{errors.description?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-black text-white font-medium w-full h-12 flex items-center justify-center transition-all active:scale-95"
          >
            {isLoading ? (
              <HashLoader
                color="#fff"
                loading={isLoading}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}
