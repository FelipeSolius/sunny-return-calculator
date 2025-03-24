
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { YearlyResult } from "../utils/calculationUtils";

interface ChartSectionProps {
  data: YearlyResult[];
}

const ChartSection = ({ data }: ChartSectionProps) => {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <Card className="p-6 glass-card">
        <h3 className="section-heading">Fluxo de Caixa Acumulado</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Ano ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativeCashFlow"
                name="Fluxo Acumulado"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cumulativeDiscountedCashFlow"
                name="Fluxo Descontado Acumulado"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 glass-card">
        <h3 className="section-heading">Receitas vs. Custos</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Ano ${label}`}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Receita"
                fill="hsl(var(--primary))"
                opacity={0.8}
              />
              <Bar
                dataKey={(data) => 
                  data.omCost + data.insuranceCost + data.admCost + 
                  data.rentCost + data.taxesIcms + data.taxesPisCofins
                }
                name="Custos + Impostos"
                fill="hsl(var(--muted-foreground))"
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ChartSection;
