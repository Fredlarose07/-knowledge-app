// backend/src/reviews/sm2.service.ts

import { Injectable } from '@nestjs/common';

export interface SM2Result {
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

@Injectable()
export class SM2Service {
  /**
   * Algorithme SuperMemo 2
   * @param quality - Note de 0 à 5
   * @param prevEasiness - Facteur E précédent
   * @param prevInterval - Intervalle précédent (jours)
   * @param prevRepetitions - Nombre de révisions réussies
   */
  calculate(
    quality: number,
    prevEasiness: number = 2.5,
    prevInterval: number = 0,
    prevRepetitions: number = 0,
  ): SM2Result {
    if (quality < 0 || quality > 5) {
      throw new Error('Quality must be between 0 and 5');
    }

    // Calculer nouveau facteur E
    let newEasiness = prevEasiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEasiness < 1.3) {
      newEasiness = 1.3;
    }

    // Si échec (quality < 3) → recommencer
    if (quality < 3) {
      return {
        easiness: newEasiness,
        interval: 1,
        repetitions: 0,
        nextReview: this.addDays(new Date(), 1),
      };
    }

    // Si succès (quality >= 3)
    const newRepetitions = prevRepetitions + 1;
    let newInterval: number;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(prevInterval * newEasiness);
    }

    return {
      easiness: newEasiness,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReview: this.addDays(new Date(), newInterval),
    };
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  getDueToday(): Date {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
  }
}