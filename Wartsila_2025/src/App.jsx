import React, { useState } from 'react';

const App = () => {
  const [selectedScenario, setSelectedScenario] = useState('current');
  const [hoveredChart, setHoveredChart] = useState(null);
  const [exportStatus, setExportStatus] = useState('');

  const wartsilaData = {
  'Operations': {
  total: 1856,
  segments: [
    { name: 'CO2 Emissions', value: 519, color: '#1F2937', percent: 28.0 },
    { name: 'Energy Generation', value: 390, color: '#374151', percent: 21.0 },
    { name: 'Fuel Consumption', value: 260, color: '#6B7280', percent: 14.0 },
    { name: 'Efficiency Contribution', value: 130, color: '#10B981', percent: 7.0 },
    { name: 'Renewable Share', value: 557, color: '#151678', percent: 30.0 }
  ]
}
,
    'Energy Solutions': {
      total: 2143,
      segments: [
        { name: 'Natural Gas', value: 857, color: '#6B7280', percent: 40.0 },
        { name: 'Diesel', value: 643, color: '#374151', percent: 30.0 },
        { name: 'Solar + Storage', value: 429, color: '#F59E0B', percent: 20.0 },
        { name: 'Wind Power', value: 214, color: '#10B981', percent: 10.0 }
      ]
    },
   
  };

  const totalEmissions = Object.values(wartsilaData).reduce((sum, d) => sum + d.total, 0);

  const allSegments = [];
  Object.entries(wartsilaData).forEach(([unit, data]) => {
    data.segments.forEach(seg => {
      allSegments.push({
        name: `${seg.name}`,
        value: seg.value,
        color: seg.color,
        percent: Math.round((seg.value / totalEmissions) * 1000) / 10
      });
    });
  });

  const wartsilaTotal = {
    total: totalEmissions,
    segments: allSegments
  };

  // Scenario configurations with real impact data
  const scenarioData = {
    current: {
      co2Reduction: 0,
      renewableIncrease: 0,
      compliance: 'warning',
      chartData: [75, 72, 70, 68], // Current declining trend
      description: 'Current performance trajectory'
    },
    renewable: {
      co2Reduction: -25.3,
      renewableIncrease: +20.0,
      compliance: 'good',
      chartData: [75, 65, 45, 35], // Significant improvement
      description: '+20% Renewable Energy Mix'
    },
    gas: {
      co2Reduction: -15.7,
      renewableIncrease: +5.2,
      compliance: 'warning',
      chartData: [75, 68, 55, 50], // Moderate improvement
      description: '+15% Gas, -15% Coal'
    },
    efficient: {
      co2Reduction: -18.9,
      renewableIncrease: +12.5,
      compliance: 'good',
      chartData: [75, 62, 48, 42], // Good improvement
      description: '+10% Energy Efficiency'
    },
    aggressive: {
      co2Reduction: -35.8,
      renewableIncrease: +28.3,
      compliance: 'good',
      chartData: [75, 58, 38, 28], // Best case scenario
      description: 'Aggressive Green Transition'
    }
  };

  const getCurrentScenario = () => scenarioData[selectedScenario];

  // Sample data - now with useState to make it updatable
  const [kpiData, setKpiData] = useState({
    totalGHG: { value: 2847, unit: 'tCO₂e', status: 'warning', target: 2500 },
    energyGeneration: { value: 15420, unit: 'MWh', status: 'good', target: 15000 },
    renewableShare: { value: 34.2, unit: '%', status: 'warning', target: 40 },
    efficiency: { value: 78.5, unit: '%', status: 'good', target: 75 }
  });

  // Apply Scenario Function - This updates the main dashboard
  const applyScenario = () => {
    if (selectedScenario === 'current') return;
    
    const scenario = getCurrentScenario();
    
    // Calculate new values based on scenario impact
    const newGHG = Math.round(kpiData.totalGHG.value * (1 + scenario.co2Reduction / 100));
    const newRenewable = Math.round((kpiData.renewableShare.value + scenario.renewableIncrease) * 10) / 10;
    const newEfficiency = Math.round((kpiData.efficiency.value + (Math.abs(scenario.co2Reduction) * 0.3)) * 10) / 10;
    
    // Update KPI data with new values
    setKpiData(prevData => ({
      ...prevData,
      totalGHG: {
        ...prevData.totalGHG,
        value: newGHG,
        status: newGHG <= prevData.totalGHG.target ? 'good' : newGHG <= prevData.totalGHG.target * 1.2 ? 'warning' : 'non-compliant'
      },
      renewableShare: {
        ...prevData.renewableShare,
        value: newRenewable,
        status: newRenewable >= prevData.renewableShare.target ? 'good' : newRenewable >= prevData.renewableShare.target * 0.8 ? 'warning' : 'non-compliant'
      },
      efficiency: {
        ...prevData.efficiency,
        value: Math.min(95, newEfficiency), // Cap at 95%
        status: newEfficiency >= prevData.efficiency.target ? 'good' : 'warning'
      }
    }));
    
    // Show success message with scenario details
    setExportStatus(`✅ ${scenario.description} applied successfully! Dashboard updated with new projections.`);
    
    // Reset to current after applying (now becomes the new baseline)
    setSelectedScenario('current');
    
    // Clear message after 5 seconds
    setTimeout(() => setExportStatus(''), 5000);
  };

  const regionalData = {
    EU: {
      total: 1247,
      segments: [
        { name: 'Coal', value: 420, color: '#374151', percent: 10.7 },
        { name: 'Gas', value: 486, color: '#6B7280', percent: 39.0 },
        { name: 'Oil', value: 187, color: '#9CA3AF', percent: 20.0 },
        { name: 'Renewable', value: 154, color: '#10B981', percent: 30.3 }
      ]
    },
    US: {
      total: 1456,
      segments: [
        { name: 'Gas', value: 583, color: '#6B7280', percent: 45.0 },
        { name: 'Oil', value: 378, color: '#9CA3AF', percent: 26.0 },
        { name: 'Coal', value: 335, color: '#374151', percent: 12.0 },
        { name: 'Renewable', value: 160, color: '#10B981', percent: 17.0 }
      ]
    },
    Global: {
      total: 3847,
      segments: [
        { name: 'Coal', value: 1539, color: '#374151', percent: 8.9 },
        { name: 'Gas', value: 1154, color: '#6B7280', percent: 15.4 },
        { name: 'Oil', value: 615, color: '#9CA3AF', percent: 50.0 },
        { name: 'Renewable', value: 539, color: '#10B981', percent: 25.7 }
      ]
    }
  };

  const metricsData = [
    { metric: 'CO₂ Emissions', eu: 1247, us: 1456, global: 3847, status: ['warning', 'non-compliant', 'warning'] },
    { metric: 'Energy Generated', eu: 5240, us: 6180, global: 15420, status: ['good', 'good', 'good'] },
    { metric: 'Renewable Share', eu: 12.3, us: 11.0, global: 14.0, status: ['warning', 'warning', 'warning'] },
    { metric: 'Fuel Consumption', eu: 2840, us: 3260, global: 8450, status: ['good', 'warning', 'warning'] },
    { metric: 'Governance', eu: 85, us: 78, global: 81, status: ['good', 'good', 'good'] },
    { metric: 'Social', eu: 92, us: 87, global: 89, status: ['good', 'good', 'good'] }
  ];

  const exportToPDF = (region) => {
    setExportStatus('Generating PDF...');
    
    const pdfContent = `
      SUSTAINABILITY REPORT - ${region}
      Generated: ${new Date().toLocaleDateString()}
      
      OVERVIEW METRICS:
      • Total GHG Emissions: ${kpiData.totalGHG.value} ${kpiData.totalGHG.unit}
      • Energy Generation: ${kpiData.energyGeneration.value} ${kpiData.energyGeneration.unit}
      • Renewable Share: ${kpiData.renewableShare.value}${kpiData.renewableShare.unit}
      • Efficiency: ${kpiData.efficiency.value}${kpiData.efficiency.unit}
      
      REGIONAL DATA (${region}):
      ${regionalData[region]?.segments.map(s => 
        `• ${s.name}: ${s.value} tCO₂e (${s.percent}%)`
      ).join('\n      ') || 'No regional data available'}
      
      COMPLIANCE STATUS:
      ${metricsData.map((row, idx) => 
        `• ${row.metric}: ${region === 'EU' ? row.eu : region === 'US' ? row.us : row.global}`
      ).join('\n      ')}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sustainability-report-${region.toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setExportStatus('PDF exported successfully!'), 1000);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const exportToExcel = (region) => {
    setExportStatus('Generating Excel/CSV...');
    
    const csvHeaders = 'Metric,Value,Unit,Status,Timestamp\n';
    const csvRows = [
      `Total GHG Emissions,${kpiData.totalGHG.value},${kpiData.totalGHG.unit},${kpiData.totalGHG.status},${new Date().toISOString()}`,
      `Energy Generation,${kpiData.energyGeneration.value},${kpiData.energyGeneration.unit},${kpiData.energyGeneration.status},${new Date().toISOString()}`,
      `Renewable Share,${kpiData.renewableShare.value},${kpiData.renewableShare.unit},${kpiData.renewableShare.status},${new Date().toISOString()}`,
      `Efficiency,${kpiData.efficiency.value},${kpiData.efficiency.unit},${kpiData.efficiency.status},${new Date().toISOString()}`,
      ...metricsData.map(row => 
        `${row.metric},${region === 'EU' ? row.eu : region === 'US' ? row.us : row.global},various,${row.status[region === 'EU' ? 0 : region === 'US' ? 1 : 2]},${new Date().toISOString()}`
      )
    ].join('\n');
    
    const csvContent = csvHeaders + csvRows;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sustainability-data-${region.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setExportStatus('CSV exported successfully!'), 1000);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const shareViaAPI = async () => {
    setExportStatus('Generating API link...');
    
    try {
      const apiData = {
        timestamp: new Date().toISOString(),
        kpis: kpiData,
        regional: regionalData,
        metrics: metricsData,
        compliance_summary: {
          total_metrics: metricsData.length,
          compliant: metricsData.filter(m => m.status.includes('good')).length,
          warnings: metricsData.filter(m => m.status.includes('warning')).length,
          non_compliant: metricsData.filter(m => m.status.includes('non-compliant')).length
        }
      };
      
      const apiResponse = {
        success: true,
        share_id: 'SUS_' + Math.random().toString(36).substring(2, 15),
        share_url: `https://api.sustainability-dashboard.com/share/${Math.random().toString(36).substring(2, 15)}`,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      await navigator.clipboard.writeText(apiResponse.share_url);
      setExportStatus(`API link copied! ID: ${apiResponse.share_id}`);
      
      const jsonBlob = new Blob([JSON.stringify(apiData, null, 2)], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `sustainability-api-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      URL.revokeObjectURL(jsonUrl);
      
    } catch (error) {
      setExportStatus('Failed to generate API link');
    }
    
    setTimeout(() => setExportStatus(''), 5000);
  };
  const StatusIndicator = ({ status, size = 'w-4 h-4' }) => {
    const colors = {
      good: 'bg-green-500',
      warning: 'bg-yellow-500',
      'non-compliant': 'bg-red-500'
    };
    return <div className={`${size} rounded-full ${colors[status]}`}></div>;
  };

  const TrafficLight = ({ status, label, value, unit, target }) => {
    const isAboveTarget = parseFloat(value) >= target;
    const displayStatus = status === 'good' && isAboveTarget ? 'good' : 
                         status === 'warning' ? 'warning' : 'non-compliant';
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
          <StatusIndicator status={displayStatus} size="w-6 h-6" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value} <span className="text-lg text-gray-600">{unit}</span>
        </div>
        <div className="text-sm text-gray-500">Target: {target} {unit}</div>
      </div>
    );
  };

  const DonutChart = ({ region, data, onHover, onLeave, radius = 60 }) => {
    const { total, segments } = data;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{region}</h3>
        <div className="relative">
          <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} className="transform -rotate-90">
            <circle
              cx={radius + strokeWidth / 2}
              cy={radius + strokeWidth / 2}
              r={normalizedRadius}
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {segments.map((segment, index) => {
              const strokeDasharray = `${segment.percent / 100 * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage / 100 * circumference;
              cumulativePercentage += segment.percent;
              
              return (
                <circle
                  key={segment.name}
                  cx={radius + strokeWidth / 2}
                  cy={radius + strokeWidth / 2}
                  r={normalizedRadius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => onHover && onHover(region, segment)}
                  onMouseLeave={onLeave}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`font-bold text-gray-800 ${radius > 60 ? 'text-2xl' : 'text-sm'}`}>{total}</div>
              <div className={`text-gray-600 ${radius > 60 ? 'text-lg' : 'text-xs'}`}>tCO₂e</div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 w-full">
          {segments.map((segment) => (
            <div key={segment.name} className="flex items-center text-xs">
              <div 
                className="w-2 h-2 rounded-full mr-4"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-gray-700">{segment.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MetricRow = ({ metric, eu, us, global, status }) => (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900 flex items-center">
        {metric}
      </td>
      <td className="py-3 px-4 text-center text-gray-800 font-semibold">{eu}</td>
      <td className="py-3 px-4 text-center text-gray-800 font-semibold">{us}</td>
      <td className="py-3 px-4 text-center text-gray-800 font-semibold">{global}</td>
      <td className="py-3 px-4">
        <div className="flex justify-center space-x-2">
          <StatusIndicator status={status[0]} />
          <StatusIndicator status={status[1]} />
          <StatusIndicator status={status[2]} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center p-3">
            Sustainability Intelligence Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content - 9 columns */}
          <div className="col-span-9 space-y-6">
            {/* Top Section: Overview KPIs */}
            <div className="grid grid-cols-4 gap-6">
              <TrafficLight 
                status={kpiData.totalGHG.status}
                label="Total GHG Emissions"
                value={kpiData.totalGHG.value}
                unit={kpiData.totalGHG.unit}
                target={kpiData.totalGHG.target}
              />
              <TrafficLight 
                status={kpiData.energyGeneration.status}
                label="Energy Generation"
                value={kpiData.energyGeneration.value}
                unit={kpiData.energyGeneration.unit}
                target={kpiData.energyGeneration.target}
              />
              <TrafficLight 
                status={kpiData.renewableShare.status}
                label="Renewable Share"
                value={kpiData.renewableShare.value}
                unit={kpiData.renewableShare.unit}
                target={kpiData.renewableShare.target}
              />
              <TrafficLight 
                status={kpiData.efficiency.status}
                label="Efficiency"
                value={kpiData.efficiency.value}
                unit={kpiData.efficiency.unit}
                target={kpiData.efficiency.target}
              />
            </div>

            {/* Middle Section: Regional Donut Charts */}
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(regionalData).map(([region, data]) => (
                <DonutChart
                  key={region}
                  region={region}
                  data={data}
                  onHover={(region, segment) => setHoveredChart({ region, segment })}
                  onLeave={() => setHoveredChart(null)}
                />
              ))}
            </div>

            {/* Wartsila Company Donut Charts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Wartsila Business Units - Emissions Overview</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Company Portfolio Analysis</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <DonutChart
                  region="Total"
                  data={wartsilaTotal}
                  onHover={(region, segment) => setHoveredChart({ region, segment })}
                  onLeave={() => setHoveredChart(null)}
                  radius={70}
                />
                <div className="space-y-6">
                  {Object.entries(wartsilaData).map(([unit, data]) => (
                    <div key={unit}>
                      <h3 className="text-lg font-semibold mb-2">{unit}</h3>
                      <div className="space-y-1">
                        {data.segments.map(segment => (
                          <div key={segment.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: segment.color}}></div>
                              <span>{segment.name}</span>
                            </div>
                            <span>{segment.value} tCO₂e ({segment.percent}%)</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-right font-semibold">Total: {data.total} tCO₂e</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Wartsila Summary Stats */}
              <div className="mt-8 grid grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalEmissions.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Emissions (tCO₂e)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12.5%</div>
                  <div className="text-sm text-gray-600">Renewable Mix</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-sm text-gray-600">Business Units</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-gray-600">Efficiency Target</div>
                </div>
              </div>
            </div>
            

            {/* Tooltip */}
            {hoveredChart && (
              <div className="fixed bg-gray-900 text-white p-3 rounded-lg shadow-lg z-50 pointer-events-none">
                <div className="font-semibold">{hoveredChart.region} - {hoveredChart.segment.name}</div>
                <div>{hoveredChart.segment.value} tCO₂e ({hoveredChart.segment.percent}%)</div>
              </div>
            )}

            {/* Bottom Section: Detailed Metrics Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Detailed Metrics</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900">Metric</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-900">EU</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-900">US</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-900">Global</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-900">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {metricsData.map((row, index) => (
                    <MetricRow key={index} {...row}/>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar - 3 columns */}
          <div className="col-span-3 space-y-6">
            {/* Alerts & Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Alerts & Actions</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <StatusIndicator status="non-compliant" />
                  <span className="ml-3 text-sm text-red-800">Missing data reported</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <StatusIndicator status="non-compliant" />
                  <span className="ml-3 text-sm text-red-800">Emission cap exceeded</span>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <StatusIndicator status="warning" />
                  <span className="ml-3 text-sm text-yellow-800">Reporting deadline approaching</span>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-6 space-y-3">
                {exportStatus && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 font-medium">
                    {exportStatus}
                  </div>
                )}
                <button 
                  onClick={() => exportToPDF('EU')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  📄 Export TxT (EU)
                </button>
                <button 
                  onClick={() => exportToExcel('US')}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  📊 Export Excel/CSV (US)
                </button>
                <button 
                  onClick={shareViaAPI}
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  🔗 API Share
                </button>
              </div>
            </div>

            {/* Scenario Simulator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Scenario Simulator</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Fuel Mix & Strategy
                  </label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                  >
                    <option value="current">Current Mix (Baseline)</option>
                    <option value="renewable">+20% Renewable Energy</option>
                    <option value="gas">+15% Gas, -15% Coal</option>
                    <option value="efficient">+10% Energy Efficiency</option>
                    <option value="aggressive">Aggressive Green Transition</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{getCurrentScenario().description}</p>
                </div>

                {/* Impact Visualization - Dynamic */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    📊 Projected Impact
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Live Update
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CO₂ Reduction:</span>
                      <div className="flex items-center">
                        <span className={`font-bold text-sm ${getCurrentScenario().co2Reduction < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {getCurrentScenario().co2Reduction > 0 ? '+' : ''}{getCurrentScenario().co2Reduction}%
                        </span>
                        {getCurrentScenario().co2Reduction < 0 && <span className="ml-1 text-green-600">↓</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Renewable Share:</span>
                      <div className="flex items-center">
                        <span className={`font-bold text-sm ${getCurrentScenario().renewableIncrease > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                          +{getCurrentScenario().renewableIncrease}%
                        </span>
                        {getCurrentScenario().renewableIncrease > 0 && <span className="ml-1 text-blue-600">↑</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compliance Status:</span>
                      <div className="flex items-center">
                        <StatusIndicator status={getCurrentScenario().compliance} />
                        <span className="ml-2 text-sm font-medium capitalize">
                          {getCurrentScenario().compliance}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Target Achievement:</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              getCurrentScenario().compliance === 'good' ? 'bg-green-500' : 
                              getCurrentScenario().compliance === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, Math.abs(getCurrentScenario().co2Reduction) * 2.5)}%` 
                            }}
                          ></div>
                        </div>

                        <span className="text-xs text-gray-600">
                          {Math.min(100, Math.abs(getCurrentScenario().co2Reduction) * 2.5).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Chart - Updates based on selection */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Emissions Projection (Next 4 Quarters)</h4>
                    <span className="text-xs text-gray-500">
                      {selectedScenario === 'current' ? 'Baseline' : 'Projected'}
                    </span>
                  </div>
                  
                  {/* Dynamic SVG Chart */}
                  <div className="h-28 bg-white rounded border relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {/* Background grid */}
                      <defs>
                        <pattern id="grid" width="20" height="14" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 14" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Chart area */}
                      <g>
                        {/* Y-axis labels */}
                        <text x="8" y="15" fontSize="10" fill="#6b7280">100</text>
                        <text x="8" y="45" fontSize="10" fill="#6b7280">50</text>
                        <text x="8" y="75" fontSize="10" fill="#6b7280">25</text>
                        <text x="8" y="105" fontSize="10" fill="#6b7280">0</text>
                        
                        {/* Data line - animated based on scenario */}
                        <polyline
                          fill="none"
                          stroke={
                            getCurrentScenario().compliance === 'good' ? '#10b981' :
                            getCurrentScenario().compliance === 'warning' ? '#f59e0b' : '#ef4444'
                          }
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={
                            getCurrentScenario().chartData.map((value, index) => 
                              `${30 + (index * 60)},${120 - value}`
                            ).join(' ')
                          }
                          className="transition-all duration-1000 ease-in-out"
                        />
                        
                        {/* Data points */}
                        {getCurrentScenario().chartData.map((value, index) => (
                          <circle
                            key={index}
                            cx={30 + (index * 60)}
                            cy={120 - value}
                            r="4"
                            fill={
                              getCurrentScenario().compliance === 'good' ? '#10b981' :
                              getCurrentScenario().compliance === 'warning' ? '#f59e0b' : '#ef4444'
                            }
                            className="transition-all duration-1000 ease-in-out"
                          >
                            <title>{`Q${index + 1}: ${value} tCO₂e`}</title>
                          </circle>
                        ))}
                        
                        {/* Target line */}
                        <line
                          x1="30"
                          y1="85"
                          x2="210"
                          y2="85"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          opacity="0.7"
                        />
                        <text x="215" y="89" fontSize="9" fill="#dc2626">Target</text>
                      </g>
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-xs mt-2 text-gray-600">
                    <span>Current</span>
                    <span>Q1 2025</span>
                    <span>Q2 2025</span>
                    <span>Q3 2025</span>
                  </div>
                  
                  {/* Scenario Impact Summary */}
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">
                        {selectedScenario === 'current' ? 'Current Trajectory' : 'Projected Outcome:'}
                      </span>
                      <span className={`font-bold ${
                        getCurrentScenario().compliance === 'good' ? 'text-green-700' :
                        getCurrentScenario().compliance === 'warning' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {getCurrentScenario().chartData[3]} tCO₂e by Q3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    className="py-2 px-3 text-xs border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setSelectedScenario('current')}
                  >
                    Reset to Current
                  </button>
                  <button 
                    className="py-2 px-3 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={selectedScenario === 'current'}
                    onClick={applyScenario}
                  >
                    {selectedScenario === 'current' ? 'Already Applied' : 'Apply Scenario'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;