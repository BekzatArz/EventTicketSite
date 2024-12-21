import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import AuthForm from "../features/auth/ui/AuthForm";
import ScrollOnRefresh from '../shared/scroll/ScrollOnRefresh';

const AuthPage = () => {
    const { i18n } = useTranslation();
    return (
      <>
      <ScrollOnRefresh />
        <motion.div
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }} 
        >
            <motion.h2
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className='welcome-to-site'
            >
                {i18n.t('welcome.welcomeToSite')}
            </motion.h2>
            <div className="auth-wrapper">
                <AuthForm />
            </div>
        </motion.div>
      </>
    );
};

export default AuthPage;
