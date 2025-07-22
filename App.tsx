import React from 'react';
import { useSchoolDayCounter, CountdownState, TimeRemaining } from './hooks/useSchoolDayCounter';
import CountdownDisplay from './components/CountdownDisplay';
import CalendarIcon from './components/icons/CalendarIcon';

// Função auxiliar para formatar o tempo total para a mensagem "Fora de Aula"
const formatTotalTime = (time: TimeRemaining): string => {
    const totalHours = time.totalHours;
    const remainingMinutes = time.minutes;
    return `${String(totalHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
};

const App: React.FC = () => {
    const { countdownState, timeRemaining, remainingDays } = useSchoolDayCounter();

    const renderContent = () => {
        switch (countdownState) {
            case CountdownState.LOADING:
                return <div className="text-slate-400 animate-pulse">A carregar...</div>;

            case CountdownState.FINISHED:
                return (
                    <div className="text-center transition-opacity duration-700 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Parabéns!</h1>
                        <p className="text-xl md:text-2xl text-slate-200">O ano letivo de 2025 terminou.</p>
                        <p className="text-base md:text-lg text-slate-400 mt-2">Boas férias e um merecido descanso!</p>
                    </div>
                );

            case CountdownState.IN_CLASS:
                return (
                    <div className="text-center w-full animate-fade-in">
                        <CountdownDisplay 
                            hours={timeRemaining.hours}
                            minutes={timeRemaining.minutes}
                            seconds={timeRemaining.seconds}
                        />
                        <p className="mt-6 text-lg md:text-xl font-medium text-slate-300">
                            Fique firme! Confia e faça o seu melhor.
                        </p>
                    </div>
                );

            case CountdownState.OUT_OF_CLASS:
                return (
                    <div className="text-center animate-fade-in">
                        <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed">
                            Você tem <span className="text-4xl md:text-5xl font-bold text-teal-400 mx-1">{formatTotalTime(timeRemaining)}</span> para mudar o seu destino!
                        </p>
                         <p className="mt-4 text-lg md:text-xl text-slate-300">
                            Foco e trabalho!
                        </p>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <main className="bg-slate-900 min-h-screen w-full flex flex-col items-center justify-center p-4 text-white antialiased overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative z-10 w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-950/50 p-8 md:p-12 border border-slate-700">
                <header className="text-center mb-8 flex flex-col items-center">
                    <CalendarIcon className="w-10 h-10 text-slate-500 mb-3" />
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Contagem Regressiva</h1>
                    <h2 className="text-lg md:text-xl text-slate-400">
                        {remainingDays > 0 ? `${remainingDays} Dias Letivos Restantes` : 'Ano Letivo 2025'}
                    </h2>
                </header>
                
                <div className="flex items-center justify-center my-8 h-48">
                    {renderContent()}
                </div>

                <footer className="text-center mt-8 pt-6 border-t border-slate-700">
                    <p className="text-sm text-slate-500">
                        O ano letivo se encerra em 17 de dezembro de 2025.
                    </p>
                </footer>
            </div>
            <div className="absolute bottom-4 text-center text-xs text-slate-600 z-10">
                <p>Criado para professores com ❤️</p>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .bg-grid-slate-800\\/40 {
                    background-image: linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </main>
    );
};

export default App;
