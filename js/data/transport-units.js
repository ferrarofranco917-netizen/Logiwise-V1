window.KedrixOneTransportUnitData = (() => {
  'use strict';

  const defaultTransportUnitTypes = [
    {
      value: '20 STANDARD DRY 22G0',
      label: '20 STANDARD DRY',
      code: '22G0',
      description: 'Container dry standard 20 piedi',
      displayValue: '20 STANDARD DRY · 22G0',
      aliases: ['20 STANDARD DRY 22G0', '20 STANDARD DRY', '22G0']
    },
    {
      value: '40 STANDARD DRY 42G1',
      label: '40 STANDARD DRY',
      code: '42G1',
      description: 'Container dry standard 40 piedi',
      displayValue: '40 STANDARD DRY · 42G1',
      aliases: ['40 STANDARD DRY 42G1', '40 STANDARD DRY', '42G1']
    },
    {
      value: '40 HC STANDARD DRY 45G1',
      label: '40 HC STANDARD DRY',
      code: '45G1',
      description: 'Container dry high cube 40 piedi',
      displayValue: '40 HC STANDARD DRY · 45G1',
      aliases: ['40 HC STANDARD DRY 45G1', '40 HC STANDARD DRY', '45G1', '40 HIGH CUBE 45G1']
    },
    {
      value: '20 BULK 22B0',
      label: '20 BULK',
      code: '22B0',
      description: 'Container bulk 20 piedi',
      displayValue: '20 BULK · 22B0',
      aliases: ['20 BULK 22B0', '20 BULK', '22B0']
    },
    {
      value: '20 OPEN TOP 22U1',
      label: '20 OPEN TOP',
      code: '22U1',
      description: 'Container open top 20 piedi',
      displayValue: '20 OPEN TOP · 22U1',
      aliases: ['20 OPEN TOP 22U1', '20 OPEN TOP', '22U1']
    },
    {
      value: '40 HC OPEN TOP 45U1',
      label: '40 HC OPEN TOP',
      code: '45U1',
      description: 'Container open top high cube 40 piedi',
      displayValue: '40 HC OPEN TOP · 45U1',
      aliases: ['40 HC OPEN TOP 45U1', '40 HC OPEN TOP', '45U1']
    },
    {
      value: '20 REEFER 22R1',
      label: '20 REEFER',
      code: '22R1',
      description: 'Container reefer 20 piedi',
      displayValue: '20 REEFER · 22R1',
      aliases: ['20 REEFER 22R1', '20 REEFER', '22R1']
    },
    {
      value: '40 HC REEFER 45R1',
      label: '40 HC REEFER',
      code: '45R1',
      description: 'Container reefer high cube 40 piedi',
      displayValue: '40 HC REEFER · 45R1',
      aliases: ['40 HC REEFER 45R1', '40 HC REEFER', '45R1']
    },
    {
      value: '20 FLAT RACK 22P3',
      label: '20 FLAT RACK',
      code: '22P3',
      description: 'Container flat rack 20 piedi',
      displayValue: '20 FLAT RACK · 22P3',
      aliases: ['20 FLAT RACK 22P3', '20 FLAT RACK', '22P3']
    },
    {
      value: '40 HC FLAT RACK 45P3',
      label: '40 HC FLAT RACK',
      code: '45P3',
      description: 'Container flat rack high cube 40 piedi',
      displayValue: '40 HC FLAT RACK · 45P3',
      aliases: ['40 HC FLAT RACK 45P3', '40 HC FLAT RACK', '45P3']
    },
    { value: 'RoRo', label: 'RoRo', displayValue: 'RoRo', aliases: ['RoRo', 'RORO'] },
    { value: 'LCL', label: 'LCL', displayValue: 'LCL', aliases: ['LCL', 'GROUPAGE'] },
    { value: 'LTL', label: 'LTL', displayValue: 'LTL', aliases: ['LTL', 'LESS THAN TRUCKLOAD'] },
    { value: 'FTL', label: 'FTL', displayValue: 'FTL', aliases: ['FTL', 'FULL TRUCKLOAD'] }
  ];

  return {
    defaultTransportUnitTypes
  };
})();
