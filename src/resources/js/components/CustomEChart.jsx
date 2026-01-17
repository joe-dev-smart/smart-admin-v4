/**
 * CustomEChart Component
 *
 * This component requires echarts and echarts-for-react packages to be installed.
 * To use this component, run:
 *   npm install echarts echarts-for-react
 *
 * Currently disabled to prevent build errors when dependencies are not installed.
 */

const CustomEChart = ({ getOptions, extensions = [], ...props }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-muted"
      style={{ minHeight: '200px', border: '1px dashed #ccc', borderRadius: '4px' }}
    >
      <span>ECharts not configured. Install echarts packages to enable.</span>
    </div>
  );
};

export default CustomEChart;
