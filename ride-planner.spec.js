describe('calcAdjustment', () => {


    it('fitnessFactor should decrease when weight increases', () => {
        const userWeightBefore = 150;
        const userWeightAfter = 250;
        const feetVal = 5;
        const inchesVal = 11;
        const userAge = 30;
        const userFitness = 'intermediate';

        const adjustmentBefore = calcAdjustment(feetVal, inchesVal, userWeightBefore, userAge, userFitness);
        const adjustmentAfter = calcAdjustment(feetVal, inchesVal, userWeightAfter, userAge, userFitness);
        
        expect(adjustmentBefore).toBeGreaterThan(adjustmentAfter);
    });

    it('fitnessFactor should increase when fitness level improves', () => {
        const weightVal = 150;
        const feetVal = 5;
        const inchesVal = 11;
        const userAge = 30;
        const userFitnessBefore = 'beginner';
        const userFitnessAfter = 'elite';

        const adjustmentBefore = calcAdjustment(feetVal, inchesVal, weightVal, userAge, userFitnessBefore);
        const adjustmentAfter = calcAdjustment(feetVal, inchesVal, weightVal, userAge, userFitnessAfter);
        
        expect(adjustmentBefore).toBeLessThan(adjustmentAfter);
    });

});