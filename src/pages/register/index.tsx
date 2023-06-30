import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import logoImg from "../../assets/logo.svg";
import { auth } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const schema = z.object({
  name: z.string().nonempty("Campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;
export function Register() {
  const navigate = useNavigate();
  const { handleInfoUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(formData: FormData) {
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: formData.name,
        });
        handleInfoUser({
          name: formData.name,
          email: formData.email,
          uid: user.user.uid,
        });
        toast.success("Usuário cadastrado com sucesso", {
          style: {
            backgroundColor: "#2ecc71",
            color: "#fff",
          },
        });
        setInterval(() => {
          navigate("/dashboard", { replace: true });
        }, 3000);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, []);
  return (
    <Container>
      <div className=" w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-full">
          <img className="w-full" src={logoImg} alt="logo" />
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-xl w-full rounded-lg p-4 drop-shadow-md"
        >
          <div className="mb-3">
            <Input
              type={"text"}
              placeholder={"Digite seu nome completo"}
              name="name"
              errors={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type={"email"}
              placeholder={"Digite seu email"}
              name="email"
              errors={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type={"password"}
              placeholder={"Digite sua senha"}
              name="password"
              errors={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-11 font-medium"
          >
            Cadastrar
          </button>
        </form>
        <Link to={"/login"}>Já possui uma conta? faça login</Link>
      </div>
    </Container>
  );
}
