import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logoImg from "../../assets/logo.svg";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;
export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(formData: FormData) {
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        toast.success("Login efetuado com sucesso");

        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        toast.error("Não foi possível realizar o login :(");
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
              type={"email"}
              placeholder={"digite seu email"}
              name="email"
              errors={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type={"password"}
              placeholder={"digite sua senha"}
              name="password"
              errors={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-11 font-medium"
          >
            Entrar
          </button>
        </form>
        <Link to={"/register"}>Ainda não possui uma conta? cadastre-se</Link>
      </div>
    </Container>
  );
}
