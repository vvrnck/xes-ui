'use client'

import useTheme from "@/hooks/useTheme";

const Footer : React.FC = () => {
    const { ButtonTheme } = useTheme();

    return (
        <>
            <footer className="flex fixed bottom-0 h-14 items-center justify-end w-full"> 
                <div className="m-3">
                    <ButtonTheme />
                </div>
            </footer>
        </>
    );
}

export default Footer;