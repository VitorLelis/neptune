interface ConversionFactors {
    [key: string]: {
      [key: string]: number;
    };
  }
  
  export const conversionFactors: ConversionFactors = {
    'SCY to SCM': {
      '50 Freestyle': 1.08,
      '50 Backstroke': 1.10,
      '50 Breaststroke': 1.12,
      '50 Butterfly': 1.09,
      '100 Freestyle': 1.11,
      '100 Backstroke': 1.12,
      '100 Breaststroke': 1.15,
      '100 Butterfly': 1.12,
    },
    'SCY to LCM': {
      '50 Freestyle': 1.09,
      '50 Backstroke': 1.12,
      '50 Breaststroke': 1.13,
      '50 Butterfly': 1.11,
      '100 Freestyle': 1.10,
      '100 Backstroke': 1.11,
      '100 Breaststroke': 1.14,
      '100 Butterfly': 1.11,
    },
    'SCM to LCM': {
      '50 Freestyle': 1.01,
      '50 Backstroke': 1.02,
      '50 Breaststroke': 1.03,
      '50 Butterfly': 1.02,
      '100 Freestyle': 1.02,
      '100 Backstroke': 1.03,
      '100 Breaststroke': 1.03,
      '100 Butterfly': 1.03,
    },
    'LCM to SCM': {
      '50 Freestyle': 0.99,
      '50 Backstroke': 0.98,
      '50 Breaststroke': 0.97,
      '50 Butterfly': 0.98,
      '100 Freestyle': 0.98,
      '100 Backstroke': 0.97,
      '100 Breaststroke': 0.97,
      '100 Butterfly': 0.97,
    },
    'LCM to SCY': {
      '50 Freestyle': 0.91,
      '50 Backstroke': 0.89,
      '50 Breaststroke': 0.88,
      '50 Butterfly': 0.90,
      '100 Freestyle': 0.90,
      '100 Backstroke': 0.90,
      '100 Breaststroke': 0.87,
      '100 Butterfly': 0.90,
    },
    'SCM to SCY': {
      '50 Freestyle': 0.93,
      '50 Backstroke': 0.91,
      '50 Breaststroke': 0.89,
      '50 Butterfly': 0.91,
      '100 Freestyle': 0.89,
      '100 Backstroke': 0.89,
      '100 Breaststroke': 0.87,
      '100 Butterfly': 0.89,
    },
  };

export function convertTime(
    time: string,
    stroke: string,
    distance: string,
    originalCourse: string,
    targetCourse: string
  ): string {
    const key = `${originalCourse} to ${targetCourse}`;
    const conversionKey = `${distance} ${stroke}`;
    const factor = conversionFactors[key][conversionKey];
  
    if (!factor) {
      throw new Error('Conversion factor not found');
    }
  
    // Regular expression to match MIN:SEC.HH or SEC.HH
    const timeRegex = /^([0-5]\d\:)?([0-5]\d\.\d{2})$/;
    const match = time.match(timeRegex);
  
    if (!match) {
      throw new Error('Invalid time format');
    }
  
    let totalSeconds: number;

    totalSeconds = parseFloat(match[2]); //SEC.HH
  
    if (match[1]) { // MIN:SEC.HH
      const minutes = parseFloat(match[1].slice(0, -1)); // Remove the trailing ':'
      totalSeconds += minutes * 60;
    } 
  
    return (totalSeconds * factor).toFixed(2);
  } 