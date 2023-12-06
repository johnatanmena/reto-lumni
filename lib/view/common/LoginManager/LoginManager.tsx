import { FormEvent, useState, useEffect  } from "react";
import styles from "./LoginManager.module.css";
import { loginWithEmailAndPassword } from "../Api/LoginApi";
import useAppState from "../AppState/useAppState";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormControl } from 'react-bootstrap';


export interface ILoginManagerProps {
  onLoginSuccess?: () => void;
  onLoginFail?: () => void;
  onError?: () => void;
}

const LoginManager = (props: ILoginManagerProps) => {
  let [contador, setContador] = useState(0);
  const [lock, setLock] = useState(false)
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const { storeSessionState } = useAppState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const localTime = localStorage.getItem('time');
    if(localTime){
      const timeDif = Date.now() - parseInt(localTime, 10);
      const minutes = Math.floor(timeDif / (1000 * 60));
      if(minutes < 5){
        setLock(true)
      }
      else {
        setLock(false);
        localStorage.removeItem('time');
      } 
    }
  }, []);



  const callLoginApi = async (email: string, password: string) => {
    setLoading(true);
    const response = await loginWithEmailAndPassword({
      email,
      password
    });
    setLoading(false);
    if (response.status === 401) {
      if(contador > 2){
        alert('Ya usó la mayoría de intentos, puedo reintentar en 5 minutos')
        const currentTime = Date.now()
        localStorage.setItem('time',currentTime.toString())
        setLock(true)
      }
      else{
      props.onLoginFail && props.onLoginFail();
      alert('Las credenciales no son correctas')
    }
    } else if (!response.isSuccess) {
      props.onError && props.onError();
    } else {
      storeSessionState({ isLogin: true, ...response.body });
      props.onLoginSuccess && props.onLoginSuccess();
    }
  }

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault()
    setContador(contador + 1)
    callLoginApi(inputEmail,inputPassword);
  };

  return (
    <section className={styles.root}>
      <section>
      <h1>Inicia sesión</h1>
      </section>
      <p>Inicia sesión con tu usuario y contraseña</p>
      <br />
      <form onSubmit={onSubmit}>
        <span>Correo electrónico:</span>
        <FormControl
          type="text"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <br />
        <span>Contraseña:</span>
        <br />
            <FormControl
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <br />
        <Button variant="primary" type="submit" disabled={lock}>Iniciar sesión</Button>
      </form>
    </section>
  )
};

export default LoginManager;
