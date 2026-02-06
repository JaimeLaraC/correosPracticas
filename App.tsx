import React, { useState, useMemo, useRef } from 'react';
import { Mail, MapPin, Calculator, Check, Search } from 'lucide-react';
import { COMPANIES, THEME } from './constants';
// Import index.css
import './index.css';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('all');
    const [sentEmail, setSentEmail] = useState<string | null>(null);

    // Draggable Scroll Logic
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Extract unique sectors
    const sectors = useMemo(() => {
        const allSectors = COMPANIES.map(c => {
            return c.sector.split('(')[0].trim();
        });
        return Array.from(new Set(allSectors));
    }, []);

    // Filter Logic
    const filteredCompanies = useMemo(() => {
        return COMPANIES.filter(company => {
            const matchesSearch =
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.mathApplication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSector = selectedSector === 'all' || company.sector.includes(selectedSector);

            return matchesSearch && matchesSector;
        });
    }, [searchTerm, selectedSector]);

    const handleEnviarSolicitud = (email: string) => {
        const asunto = 'Solicitud Prácticas de Verano';
        const cuerpo = `Estimado/a responsable de selección:

Mi nombre es Marta Romero y actualmente soy estudiante del Grado en Matemáticas en la Universidad de Castilla-La Mancha. Me pongo en contacto con ustedes para expresar mi interés en realizar prácticas de verano en su empresa, con el objetivo de aplicar y ampliar mis conocimientos académicos en un entorno profesional.

A lo largo de mi formación universitaria he desarrollado una sólida base en análisis matemático, resolución de problemas y modelización, así como conocimientos en programación básica en Python, MATLAB y algoritmos de optimización. Además, cuento con experiencia en el ámbito educativo como profesora particular y mentora académica, lo que me ha permitido fortalecer habilidades como la comunicación, la organización y el trabajo con responsabilidad y compromiso.

Me considero una persona motivada, con gran capacidad de aprendizaje y muchas ganas de adquirir experiencia práctica que complemente mi formación académica. Adjunto mi currículum vitae para su consideración y quedo a su disposición para ampliar cualquier información o realizar una entrevista.

Agradezco de antemano su tiempo y atención.

Atentamente,
Marta Romero
Grado en Matemáticas – Universidad de Castilla-La Mancha
Marta.Romero14@alu.uclm.es
+34 682 888 102`;

        const outlookUrl = `https://outlook.office365.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.open(outlookUrl, '_blank');
        setSentEmail(email);
        setTimeout(() => setSentEmail(null), 2000);
    };

    return (
        <div className={`${THEME.bgApp} ${THEME.font} transition-colors duration-500`}>
            <div className={THEME.container}>
                {/* Header */}
                <header className={THEME.header.wrapper}>
                    <span className={THEME.header.tag}>Directorio Profesional</span>
                    <h1 className={THEME.header.title}>Empresas de Ciudad Real</h1>
                    <p className={THEME.header.subtitle}>
                        Un directorio curado de empresas con foco en la transformación digital y aplicaciones matemáticas.
                        Explora oportunidades, contacta y crece.
                    </p>

                    <div className={THEME.header.stats}>
                        <div className={THEME.header.statItem}>
                            <span className="text-2xl font-bold block">{COMPANIES.length}</span>
                            <span className="text-sm opacity-70">Empresas</span>
                        </div>
                        <div className={THEME.header.statItem}>
                            <span className="text-2xl font-bold block">{sectors.length}</span>
                            <span className="text-sm opacity-70">Sectores</span>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className={THEME.filterBar.wrapper}>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        <input
                            type="text"
                            placeholder="Buscar empresa, sector, math..."
                            className={`${THEME.filterBar.input} pl-10`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className={`${THEME.filterBar.sectorContainer} cursor-grab active:cursor-grabbing select-none`}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        <button
                            onClick={() => setSelectedSector('all')}
                            className={selectedSector === 'all' ? THEME.filterBar.chipActive : THEME.filterBar.chipInactive}
                        >
                            Todos
                        </button>
                        {sectors.map(sector => (
                            <button
                                key={sector}
                                onClick={() => setSelectedSector(sector)}
                                className={selectedSector === sector ? THEME.filterBar.chipActive : THEME.filterBar.chipInactive}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>

                    <div className={THEME.filterBar.resultsText}>
                        {filteredCompanies.length} resultados
                    </div>
                </div>

                {/* Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`}>
                    {filteredCompanies.map((company) => (
                        <article key={company.id} className={`${THEME.card.wrapper} animate-fade-in`}>
                            <span className={THEME.card.number}>{company.id < 10 ? `0${company.id}` : company.id}</span>

                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={THEME.card.badges.sector}>
                                        {company.sector}
                                    </span>
                                    <span className={THEME.card.badges.location}>
                                        <MapPin size={10} className="mr-1" />
                                        {company.location}
                                    </span>
                                </div>
                                <h2 className={THEME.card.title}>{company.name}</h2>
                            </div>

                            <div className={THEME.card.mathApp}>
                                <div className="flex items-center gap-2 mb-2 font-semibold opacity-90">
                                    <Calculator size={14} />
                                    <span>Aplicación Matemática:</span>
                                </div>
                                <p className="leading-relaxed">
                                    {company.mathApplication}
                                </p>
                            </div>

                            <button
                                onClick={() => handleEnviarSolicitud(company.email)}
                                className={sentEmail === company.email ? THEME.card.buttonCopied : THEME.card.button}
                            >
                                {sentEmail === company.email ? (
                                    <>
                                        <Check size={18} />
                                        <span>¡Abierto en Outlook!</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail size={18} />
                                        <span>📩 Enviar solicitud</span>
                                    </>
                                )}
                            </button>
                        </article>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl">No se encontraron empresas con esos criterios.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;