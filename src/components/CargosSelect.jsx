import { useEffect, useState } from 'react';

const jobTitles = [
    'Administrativo',
    'Analista de PCP',
    'Auxiliar Fiscal',
    'Comercial',
    'Compras',
    'Consultor',
    'Contador',
    'Controller',
    'Diretor',
    'Faturamento',
    'Faturista',
    'Financeiro',
    'Fiscal',
    'Gerente',
    'Gerente Administrativo',
    'Gerente Comercial',
    'Gerente de Produção',
    'Gerente Geral',
    'Gerente Industrial',
    'Laboratório',
    'PCP',
    'RH',
    'TI',
    'Vendas',
    'Outro'
];

const CustomJobTitleSelect = ({ value, onChange, placeholder }) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const [selectValue, setSelectValue] = useState('');

    // Initialize the component state based on the value prop
    useEffect(() => {
        if (!value) {
            setSelectValue('');
            setIsCustom(false);
        } else if (jobTitles.includes(value)) {
            setSelectValue(value);
            setIsCustom(false);
        } else {
            setSelectValue('Outro');
            setCustomValue(value);
            setIsCustom(true);
        }
    }, [value]);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectValue(selectedValue);

        if (selectedValue === 'Outro') {
            setIsCustom(true);
            onChange(customValue || '');
        } else {
            setIsCustom(false);
            onChange(selectedValue);
        }
    };

    const handleCustomInputChange = (e) => {
        const newValue = e.target.value;
        setCustomValue(newValue);
        onChange(newValue);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <select
                value={selectValue}
                onChange={handleSelectChange}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: isCustom ? '8px' : '0',
                    color: '#374151',
                    borderRadius: '0.375rem',
                    borderColor: '#D1D5DB',
                    fontSize: '0.875rem'
                }}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400 text-gray-800 bg-white"
            >
                <option value="" disabled selected>{placeholder || "Selecione ou digite algo"}</option>
                {jobTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                ))}
            </select>

            {isCustom && (
                <input
                    type="text"
                    value={customValue}
                    onChange={handleCustomInputChange}
                    placeholder="Digite seu cargo"
                    style={{
                        width: '100%',
                        padding: '8px',
                        color: '#374151', 
                        borderRadius: '0.375rem',
                        borderColor: '#D1D5DB',
                        fontSize: '0.875rem'
                    }}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400 text-gray-800 bg-white"
                />
            )}
        </div>
    );
};

export default CustomJobTitleSelect;
