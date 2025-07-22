import { useState, useEffect } from 'react';
import { SCHOOL_DAYS_2025 } from '../constants/schoolDays';

// Define os possíveis estados da contagem regressiva
export enum CountdownState {
  LOADING,
  IN_CLASS,
  OUT_OF_CLASS,
  FINISHED,
}

// Define a estrutura para o tempo restante
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
}

// Função para formatar a data para YYYY-MM-DD para comparação
const toYYYYMMDD = (date: Date): string => {
    return date.toISOString().slice(0, 10);
};

// Ordena os dias letivos para uma pesquisa eficiente
const sortedSchoolDays = Array.from(SCHOOL_DAYS_2025).sort();

export const useSchoolDayCounter = () => {
    const [countdownState, setCountdownState] = useState<CountdownState>(CountdownState.LOADING);
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const todayStr = toYYYYMMDD(now);
            const currentHour = now.getHours();

            // Atualiza a contagem total de dias letivos restantes
            const futureSchoolDays = sortedSchoolDays.filter(dayStr => {
                const schoolDate = new Date(`${dayStr}T00:00:00`);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return schoolDate >= today;
            });
            setRemainingDays(futureSchoolDays.length);

            // Encontra o índice do dia letivo de hoje ou do próximo
            const nextSchoolDayIndex = sortedSchoolDays.findIndex(d => d >= todayStr);

            if (nextSchoolDayIndex === -1) {
                setCountdownState(CountdownState.FINISHED);
                return;
            }

            const isTodaySchoolDay = sortedSchoolDays[nextSchoolDayIndex] === todayStr;

            let targetDate: Date;

            // ESTADO 1: EM_AULA
            if (isTodaySchoolDay && currentHour >= 13 && currentHour < 17) {
                setCountdownState(CountdownState.IN_CLASS);
                targetDate = new Date(now);
                targetDate.setHours(17, 0, 0, 0);
            } 
            // ESTADO 2: FORA_DE_AULA
            else {
                setCountdownState(CountdownState.OUT_OF_CLASS);
                let nextDayStr;
                
                if (isTodaySchoolDay && currentHour < 13) {
                    // Se for um dia de aula, antes das 13h, o alvo é hoje às 13h.
                    nextDayStr = todayStr;
                } else {
                    // Se for depois das 17h num dia de aula, ou num dia não-letivo.
                    const idx = isTodaySchoolDay ? nextSchoolDayIndex + 1 : nextSchoolDayIndex;
                    if (idx < sortedSchoolDays.length) {
                        nextDayStr = sortedSchoolDays[idx];
                    } else {
                        // Não há mais dias letivos
                        setCountdownState(CountdownState.FINISHED);
                        return;
                    }
                }
                
                targetDate = new Date(`${nextDayStr}T13:00:00`);
            }
            
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                 setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });
                 return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            const totalHours = Math.floor(diff / (1000 * 60 * 60));

            setTimeRemaining({ days, hours, minutes, seconds, totalHours });

        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return { countdownState, timeRemaining, remainingDays };
};
