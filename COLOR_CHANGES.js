

const colorMap = {
    // Background colors
    'bg-blue-50': 'bg-green-50',
    'bg-blue-100': 'bg-green-100',
    'bg-blue-600': 'style={{ backgroundColor: "#074F06" }}',
    'bg-blue-700': 'style={{ backgroundColor: "#053d05" }}',

    // Text colors  
    'text-blue-400': 'style={{ color: "#074F06" }}',
    'text-blue-600': 'style={{ color: "#074F06" }}',
    'text-blue-700': 'style={{ color: "#074F06" }}',
    'text-blue-800': 'style={{ color: "#053d05" }}',

    // Hover states
    'hover:bg-blue-50': 'hover:bg-green-50',
    'hover:bg-blue-700': 'onMouseEnter/Leave with #053d05',
    'hover:bg-blue-800': 'onMouseEnter/Leave with #042d04',
    'hover:text-blue-800': 'onMouseEnter/Leave with #053d05',

    // Focus rings
    'focus:ring-blue-300': 'onFocus with boxShadow #074F06',
    'focus:ring-blue-500': 'onFocus with boxShadow #074F06',
    'focus:border-blue-400': 'onFocus with border #074F06',

    // Hex values
    '#074F06': 'Primary green',
    '#053d05': 'Hover green (darker)',
    '#042d04': 'Active green (darkest)',
};

export default colorMap;
