
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  SystemData,
  CostData,
  TariffData,
  FinancialData
} from '../utils/calculationUtils';

interface InputSectionProps {
  onDataChange: (data: {
    systemData: SystemData;
    costData: CostData;
    tariffData: TariffData;
    financialData: FinancialData;
  }) => void;
}

const InputSection = ({ onDataChange }: InputSectionProps) => {
  const [systemData, setSystemData] = useState<SystemData>({
    power: 100,
    annualGeneration: 150,
    contractedDemand: 75
  });

  const [costData, setCostData] = useState<CostData>({
    capexPerWp: 4.5,
    insurancePercent: 0.5,
    omPercent: 1.0,
    admPercent: 2.0,
    rent: 1000,
    inverterReplacePercent: 15
  });

  const [tariffData, setTariffData] = useState<TariffData>({
    energyTariff: 300,
    tusd: 200,
    tusdgDemand: 20,
    tusdcDemand: 15,
    icmsPercent: 18,
    pisCofinsPercent: 9.25
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    discountRate: 12,
    adjustmentType: "IPCA",
    adjustmentRate: 4.5,
    annualDegradation: 0.5,
    depreciationYears: 10,
    projectYears: 25
  });

  const handleChange = (
    section: 'system' | 'cost' | 'tariff' | 'financial',
    field: string,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;

    switch (section) {
      case 'system':
        setSystemData(prev => ({ ...prev, [field]: numValue }));
        break;
      case 'cost':
        setCostData(prev => ({ ...prev, [field]: numValue }));
        break;
      case 'tariff':
        setTariffData(prev => ({ ...prev, [field]: numValue }));
        break;
      case 'financial':
        if (field === 'adjustmentType') {
          setFinancialData(prev => ({ ...prev, [field]: value }));
        } else {
          setFinancialData(prev => ({ ...prev, [field]: numValue }));
        }
        break;
    }

    onDataChange({ systemData, costData, tariffData, financialData });
  };

  return (
    <Card className="p-6 glass-card animate-fade-in">
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="system" className="tab-button">Sistema</TabsTrigger>
          <TabsTrigger value="costs" className="tab-button">Custos</TabsTrigger>
          <TabsTrigger value="tariffs" className="tab-button">Tarifas</TabsTrigger>
          <TabsTrigger value="financial" className="tab-button">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4 animate-slide-in">
          <div className="input-group">
            <Label htmlFor="power" className="label-tag">Potência CC (kWp)</Label>
            <Input
              id="power"
              type="number"
              value={systemData.power}
              onChange={(e) => handleChange('system', 'power', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="annualGeneration" className="label-tag">Geração Anual (MWh) - P90</Label>
            <Input
              id="annualGeneration"
              type="number"
              value={systemData.annualGeneration}
              onChange={(e) => handleChange('system', 'annualGeneration', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="contractedDemand" className="label-tag">Demanda Contratada (kW)</Label>
            <Input
              id="contractedDemand"
              type="number"
              value={systemData.contractedDemand}
              onChange={(e) => handleChange('system', 'contractedDemand', e.target.value)}
              className="input-field"
            />
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4 animate-slide-in">
          <div className="input-group">
            <Label htmlFor="capexPerWp" className="label-tag">Capex (R$/Wp)</Label>
            <Input
              id="capexPerWp"
              type="number"
              step="0.01"
              value={costData.capexPerWp}
              onChange={(e) => handleChange('cost', 'capexPerWp', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="insurancePercent" className="label-tag">Seguros (%)</Label>
            <Input
              id="insurancePercent"
              type="number"
              step="0.1"
              value={costData.insurancePercent}
              onChange={(e) => handleChange('cost', 'insurancePercent', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="omPercent" className="label-tag">O&M (%)</Label>
            <Input
              id="omPercent"
              type="number"
              step="0.1"
              value={costData.omPercent}
              onChange={(e) => handleChange('cost', 'omPercent', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="admPercent" className="label-tag">ADM (%)</Label>
            <Input
              id="admPercent"
              type="number"
              step="0.1"
              value={costData.admPercent}
              onChange={(e) => handleChange('cost', 'admPercent', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="rent" className="label-tag">Aluguel (R$/mês) - Ano 1</Label>
            <Input
              id="rent"
              type="number"
              value={costData.rent}
              onChange={(e) => handleChange('cost', 'rent', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="inverterReplacePercent" className="label-tag">Troca de Inversores (%)</Label>
            <Input
              id="inverterReplacePercent"
              type="number"
              step="0.1"
              value={costData.inverterReplacePercent}
              onChange={(e) => handleChange('cost', 'inverterReplacePercent', e.target.value)}
              className="input-field"
            />
          </div>
        </TabsContent>

        <TabsContent value="tariffs" className="space-y-4 animate-slide-in">
          <div className="input-group">
            <Label htmlFor="energyTariff" className="label-tag">TE (R$/MWh)</Label>
            <Input
              id="energyTariff"
              type="number"
              step="0.01"
              value={tariffData.energyTariff}
              onChange={(e) => handleChange('tariff', 'energyTariff', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="tusd" className="label-tag">TUSD (R$/MWh)</Label>
            <Input
              id="tusd"
              type="number"
              step="0.01"
              value={tariffData.tusd}
              onChange={(e) => handleChange('tariff', 'tusd', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="tusdgDemand" className="label-tag">TUSDg (R$/kW)</Label>
            <Input
              id="tusdgDemand"
              type="number"
              step="0.01"
              value={tariffData.tusdgDemand}
              onChange={(e) => handleChange('tariff', 'tusdgDemand', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="tusdcDemand" className="label-tag">TUSDc (R$/kW)</Label>
            <Input
              id="tusdcDemand"
              type="number"
              step="0.01"
              value={tariffData.tusdcDemand}
              onChange={(e) => handleChange('tariff', 'tusdcDemand', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="icmsPercent" className="label-tag">ICMS (%)</Label>
            <Input
              id="icmsPercent"
              type="number"
              step="0.1"
              value={tariffData.icmsPercent}
              onChange={(e) => handleChange('tariff', 'icmsPercent', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="pisCofinsPercent" className="label-tag">PIS/COFINS (%)</Label>
            <Input
              id="pisCofinsPercent"
              type="number"
              step="0.01"
              value={tariffData.pisCofinsPercent}
              onChange={(e) => handleChange('tariff', 'pisCofinsPercent', e.target.value)}
              className="input-field"
            />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 animate-slide-in">
          <div className="input-group">
            <Label htmlFor="discountRate" className="label-tag">Taxa de Desconto (%)</Label>
            <Input
              id="discountRate"
              type="number"
              step="0.1"
              value={financialData.discountRate}
              onChange={(e) => handleChange('financial', 'discountRate', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="adjustmentRate" className="label-tag">Taxa de Reajuste (%)</Label>
            <Input
              id="adjustmentRate"
              type="number"
              step="0.1"
              value={financialData.adjustmentRate}
              onChange={(e) => handleChange('financial', 'adjustmentRate', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="annualDegradation" className="label-tag">Degradação Anual (%)</Label>
            <Input
              id="annualDegradation"
              type="number"
              step="0.1"
              value={financialData.annualDegradation}
              onChange={(e) => handleChange('financial', 'annualDegradation', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="depreciationYears" className="label-tag">Anos de Depreciação</Label>
            <Input
              id="depreciationYears"
              type="number"
              value={financialData.depreciationYears}
              onChange={(e) => handleChange('financial', 'depreciationYears', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="projectYears" className="label-tag">Anos do Projeto</Label>
            <Input
              id="projectYears"
              type="number"
              value={financialData.projectYears}
              onChange={(e) => handleChange('financial', 'projectYears', e.target.value)}
              className="input-field"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InputSection;
