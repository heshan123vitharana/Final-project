import { useState, useEffect, useRef } from 'react';
import PageTitle from './PageTitle';

const crewMembers = [
	{
		name: 'Dr. Jagath Perera',
		role: 'Chairman & CEO',
		image: 'https://randomuser.me/api/portraits/men/32.jpg',
		category: 'Leadership',
		bio: 'Visionary leader with over 30 years of experience in agricultural policy and management.',
	},
	{
		name: 'Indira Samaranayake',
		role: 'Director of Operations',
		image: 'https://randomuser.me/api/portraits/women/44.jpg',
		category: 'Operations',
		bio: 'Manages nationwide logistics and ensures the seamless flow of paddy from farm to market.',
	},
	{
		name: 'Rohan de Silva',
		role: 'Chief Financial Officer',
		image: 'https://randomuser.me/api/portraits/men/65.jpg',
		category: 'Leadership',
		bio: 'Oversees financial strategy, ensuring the fiscal health and sustainability of the board.',
	},
	{
		name: 'Anusha Kumari',
		role: 'Head of Quality Assurance',
		image: 'https://randomuser.me/api/portraits/women/68.jpg',
		category: 'Operations',
		bio: 'Dedicated to upholding the highest standards of quality for all PMB rice products.',
	},
	{
		name: 'Kasun Rajapakse',
		role: 'Head of Farmer Relations',
		image: 'https://randomuser.me/api/portraits/men/78.jpg',
		category: 'Marketing',
		bio: 'Works directly with farming communities to build strong, mutually beneficial partnerships.',
	},
	{
		name: 'Shamila Vithanage',
		role: 'IT & Digital Transformation Lead',
		image: 'https://randomuser.me/api/portraits/women/76.jpg',
		category: 'Innovation',
		bio: 'Drives technological adoption to modernize PMB’s operations and enhance efficiency.',
	},
];

const galleryImages = [
	{
		src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop&crop=center',
		thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop&crop=center',
		alt: 'A modern logistics and distribution center',
		title: 'Achievements',
		description: 'State-of-the-art warehouses ensuring an efficient national supply chain.',
	},
	{
		src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop&crop=center',
		thumb: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop&crop=center',
		alt: 'A farmer standing in a lush paddy field',
		title: 'Community',
		description: 'Empowering local farmers through fair prices and dedicated support systems.',
	},
	{
		src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=800&fit=crop&crop=center',
		thumb: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop&crop=center',
		alt: 'A team inspecting rice quality',
		title: 'Innovation',
		description: 'Implementing cutting-edge technology for quality assurance and control.',
	},
	{
		src: 'https://images.unsplash.com/photo-1523741543-91ae7370147e?w=800&h=800&fit=crop&crop=center',
		thumb: 'https://images.unsplash.com/photo-1523741543-91ae7370147e?w=400&h=400&fit=crop&crop=center',
		alt: 'Lush green paddy fields under a clear sky',
		title: 'Sustainability',
		description: 'Promoting eco-friendly farming practices for a greener Sri Lanka.',
	},
	{
		src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=800&fit=crop&crop=center',
		thumb: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop&crop=center',
		alt: 'A delicious-looking plate of rice and curry',
		title: 'Harvest',
		description: 'Delivering nutritious, high-quality rice to every table in the nation.',
	},
];

const galleryCategories = [
	'All',
	'Achievements',
	'Community',
	'Innovation',
	'Sustainability',
	'Harvest',
];

const About = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [showCrew, setShowCrew] = useState(false);
	const [showGallery, setShowGallery] = useState(false);
	const [lightboxImg, setLightboxImg] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [carouselIndex, setCarouselIndex] = useState(0);
	const [selectedCrewCategory, setSelectedCrewCategory] = useState('All');
	const [crewCarouselIndex, setCrewCarouselIndex] = useState(0);
	const carouselRef = useRef(null);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const openImagePopup = (image) => setSelectedImage(image);
	const closeImagePopup = () => setSelectedImage(null);

	// Close modals on ESC key press
	useEffect(() => {
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				if (selectedImage) {
					closeImagePopup();
				} else if (isModalOpen) {
					closeModal();
				}
			}
		};
		if (isModalOpen || selectedImage) {
			document.addEventListener('keydown', handleEsc, false);
		}
		return () => {
			document.removeEventListener('keydown', handleEsc, false);
		};
	}, [isModalOpen, selectedImage]);

	const filteredImages =
		selectedCategory === 'All'
			? galleryImages
			: galleryImages.filter((img) => img.title === selectedCategory);

	const visibleImages = filteredImages.slice(carouselIndex, carouselIndex + 3);

	const handlePrev = () => {
		setCarouselIndex((idx) => Math.max(0, idx - 1));
	};
	const handleNext = () => {
		setCarouselIndex((idx) => Math.min(filteredImages.length - 3, idx + 1));
	};

	const filteredCrewMembers =
		selectedCrewCategory === 'All'
			? crewMembers
			: crewMembers.filter((member) => member.role === selectedCrewCategory);

	const handleCrewPrev = () => {
		setCrewCarouselIndex((idx) => Math.max(0, idx - 1));
	};
	const handleCrewNext = () => {
		setCrewCarouselIndex((idx) => Math.min(filteredCrewMembers.length - 3, idx + 1));
	};

	return (
		<>
			<section id="about" className="relative bg-white overflow-hidden pt-10 pb-20">
				{/* Professional Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/50"></div>

				{/* Subtle Pattern Overlay */}
				<div className="absolute inset-0 opacity-[0.02]">
					<div
						className="w-full h-full"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
							backgroundSize: '60px 60px',
						}}
					></div>
				</div>

				<div className="relative container mx-auto px-4 max-w-7xl">
					{/* Professional Page Title */}
					<PageTitle
						subtitle="About PMB Sri Lanka"
						title="Paddy Marketing Board of Sri Lanka"
						description="Established in 1971, the Paddy Marketing Board (PMB) is the cornerstone of Sri Lanka's rice sector. For over five decades, we have been dedicated to ensuring national food security, empowering local farmers, and delivering high-quality rice to every household. Our unwavering commitment to these principles has cemented our position as the nation's premier paddy marketing institution."
						className="bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 mb-16"
						titleClassName="professional-title enhanced-text-display responsive-title-text"
						subtitleClassName="professional-subtitle responsive-subtitle-text"
						descriptionClassName="professional-description enhanced-text-display responsive-description-text"
					/>
					{/* Professional Content Grid */}
					<div className="grid lg:grid-cols-2 gap-12 mb-16">
						{/* Main Content Card */}
						<div className="group bg-white p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
							{/* Decorative Background */}
							<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10"></div>
							<div className="relative z-10">
								<div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">
									Our Mission
								</h3>
								<p className="professional-description text-gray-600 mb-6 leading-relaxed">
									To empower Sri Lankan paddy farmers by providing a stable and profitable market, while ensuring the availability of high-quality rice for consumers. We are committed to maintaining a strategic national paddy reserve, promoting fair trade, and implementing innovative technologies to create a resilient and sustainable rice economy for the nation.
								</p>
								<h4 className="professional-subtitle text-lg font-bold text-gray-900 mb-4">
									Key Services
								</h4>
								<div className="space-y-3">
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Strategic rice reserves for national food security
										</p>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Sustainable farming practices and innovation
										</p>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Quality rice products delivered nationwide
										</p>
									</div>
								</div>
								{/* Decorative Element */}
								<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mb-16 -mr-16"></div>
							</div>
						</div>
						{/* Vision & Values Card */}
						<div className="group bg-white p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
							{/* Decorative Background */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10"></div>
							<div className="relative z-10">
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</div>
								<h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">
									Our Vision
								</h3>
								<p className="professional-description text-gray-600 mb-6 leading-relaxed">
									To be a globally recognized leader in agricultural marketing, renowned for our pivotal role in Sri Lanka's food security and our innovative, technology-driven approach to creating a sustainable and prosperous future for our farming communities and stakeholders.
								</p>
								<h4 className="professional-subtitle text-lg font-bold text-gray-900 mb-4">
									Core Values
								</h4>
								<div className="space-y-3">
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Integrity in all our operations
										</p>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Excellence in service delivery
										</p>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="professional-description text-gray-600 text-sm">
											Innovation for sustainable growth
										</p>
									</div>
								</div>
								{/* Decorative Element */}
								<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mb-16 -mr-16"></div>
							</div>
						</div>
					</div>

					{/* Crew Section - Matching About PMB Sri Lanka size and layout */}
					<div className="mt-16">
						<section className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl px-8 py-12 border-emerald-100">
						<div className="text-center mb-8">
							<div className="flex flex-col items-center">
								<span className="uppercase text-emerald-700 font-semibold tracking-wide mb-2 text-lg">
									ABOUT PMB CREW
								</span>
								<div className="w-24 h-1 bg-emerald-500 rounded-full mb-4"></div>
							</div>
							<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
								PMB Leadership & Staff
							</h2>
							<p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto mb-6">
								Our strength lies in our people. Meet the dedicated and experienced professionals who are the driving force behind the Paddy Marketing Board's success. From strategic leadership to on-the-ground operations, our team is committed to uplifting Sri Lanka's agricultural sector and ensuring national food security.
							</p>
						</div>
						{/* Crew Category Chips */}
						<div className="flex flex-wrap justify-center gap-3 mb-8">
							{['All', 'Leadership', 'Operations', 'Marketing'].map((cat) => (
								<button
									key={cat}
									onClick={() => setSelectedCrewCategory(cat)}
									className={`px-5 py-2 rounded-full font-semibold border transition-all duration-300 text-sm shadow-sm font-sans
					         ${
								selectedCrewCategory === cat
									? "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-700 shadow-md"
									: "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:shadow-sm"
							}`}
								>
									{cat}
								</button>
							))}
						</div>
						{/* Crew Carousel - Matching About PMB Sri Lanka structure */}
						<div className="relative flex items-center justify-center">
							<button
								onClick={handleCrewPrev}
								disabled={crewCarouselIndex === 0}
								className="absolute left-0 z-10 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border-2 border-emerald-300 transition-all duration-300"
								aria-label="Previous"
							>
								<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
							</button>
							<div className="flex gap-6 px-8 overflow-hidden w-full">
								{filteredCrewMembers
									.slice(crewCarouselIndex, crewCarouselIndex + 3)
									.map((member, idx) => (
										<div
											key={idx}
											className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 flex flex-col items-center justify-start cursor-pointer hover:shadow-2xl w-full max-w-sm group border border-gray-200/80 overflow-hidden"
											style={{ zIndex: 10 - idx }}
										>
											{/* Professional Background Overlay */}
											<div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											
											{/* Card Content */}
											<div className="relative p-6 flex flex-col items-center text-center w-full">
												{/* Profile Image with Enhanced Styling */}
												<div className="relative mb-4 flex-shrink-0">
													<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
														<img
															src={member.image}
															alt={member.name}
															className="w-full h-full object-cover"
														/>
													</div>
													{/* PMB Badge */}
													<div className="absolute bottom-0 right-0 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm border-2 border-white">
														PMB
													</div>
												</div>
												
												{/* Member Information */}
												<div className="flex-grow flex flex-col items-center justify-center">
													<h3 className="text-xl font-bold text-gray-800 font-sans mb-1 group-hover:text-emerald-600 transition-colors duration-300">
														{member.name}
													</h3>
													<p className="text-sm text-emerald-600 font-semibold mb-3">
														{member.role}
													</p>
													<p className="text-sm text-gray-600 font-medium px-4 mb-4 flex-grow">
														{member.bio}
													</p>
												</div>
												
												{/* Category Footer */}
												<div className="w-full mt-auto pt-4 border-t border-gray-200">
													<p className="text-xs text-gray-500 font-medium text-center uppercase tracking-wider">
														{member.category}
													</p>
												</div>
											</div>
										</div>
									))}
							</div>
							<button
								onClick={handleCrewNext}
								disabled={crewCarouselIndex >= filteredCrewMembers.length - 3}
								className="absolute right-0 z-10 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border-2 border-emerald-300 transition-all duration-300"
								aria-label="Next"
							>
								<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" /></svg>
							</button>
						</div>
					</section>

					{/* Gallery Section - Horizontal carousel with category filter */}
					<div className="mt-16">
						<section className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl px-8 py-12 border border-emerald-100">
							<div className="text-center mb-8">
								<div className="flex flex-col items-center">
									<span className="uppercase text-emerald-700 font-semibold tracking-wide mb-2 text-lg">
										About PMB Sri Lanka
									</span>
									<div className="w-24 h-1 bg-emerald-500 rounded-full mb-4"></div>
								</div>
								<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
									PMB Operations & Achievements
								</h2>
								<p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto mb-6">
									From landmark achievements in food security to our deep-rooted community engagement and pioneering sustainable practices, discover the story of PMB's journey. This gallery showcases our operational excellence, industry leadership, and the positive impact we've made across the nation.
								</p>
							</div>
							{/* Category Chips */}
							<div className="flex flex-wrap justify-center gap-3 mb-8">
								{galleryCategories.map((cat) => (
									<button
										key={cat}
										onClick={() => {
											setSelectedCategory(cat);
											setCarouselIndex(0);
										}}
										className={`px-5 py-2 rounded-full font-semibold border transition-all duration-300 text-sm shadow-sm font-sans
					         ${
								selectedCategory === cat
									? "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-700 shadow-md"
									: "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:shadow-sm"
							}`}
									>
										{cat}
									</button>
								))}
							</div>
							{/* Carousel */}
							<div className="relative flex items-center justify-center">
								<button
									onClick={handlePrev}
									disabled={carouselIndex === 0}
									className="absolute left-0 z-10 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border-2 border-emerald-300 transition-all duration-300"
									aria-label="Previous"
								>
									<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
								</button>
								<div
									ref={carouselRef}
									className="flex gap-6 px-8 overflow-hidden w-full"
								>
									{visibleImages.map((img, idx) => (
										<div
											key={idx}
											className="relative bg-white rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-2 hover:shadow-2xl w-full max-w-sm h-48 group border border-emerald-100"
											style={{ zIndex: 10 - idx }}
										>
											<img
												src={img.thumb}
												alt={img.alt}
												className="w-full h-full object-cover rounded-2xl"
											/>
										</div>
									))}
								</div>
								<button
									onClick={handleNext}
									disabled={carouselIndex >= filteredImages.length - 3}
									className="absolute right-0 z-10 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border-2 border-emerald-300 transition-all duration-300"
									aria-label="Next"
								>
									<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" /></svg>
								</button>
							</div>
							<div className="text-center mt-6">
								<button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 font-sans">
									View More
									<svg
										width="20"
										height="20"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path d="M7 7l5 5-5 5" />
									</svg>
								</button>
							</div>
						</section>
					</div>
				</div>
			</div>
			</section>
			{/* Enhanced Modal with AI-Generated Images */}
			{isModalOpen && (
				<div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
					<div className="bg-white rounded-3xl shadow-2xl max-h-[85vh] w-full max-w-3xl flex flex-col overflow-hidden border border-gray-200/20 relative">
						{/* Modern Exit Button Positioned ON the Container */}
						<div className="absolute top-6 right-6 z-50">
							<button
								onClick={closeModal}
								className="group bg-white/90 hover:bg-red-50 border border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-200/30 backdrop-blur-sm"
								aria-label="Close modal"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div
							className="p-10 overflow-y-auto"
							style={{ maxHeight: '70vh' }}
						>
							{/* Modal Content Here (already present) */}
							{/* ...existing code... */}
						</div>
					</div>
				</div>
			)}
			{/* Image Popup Modal */}
			{selectedImage && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="relative max-w-5xl max-h-[90vh] w-full">
						{/* Close Button - Fixed positioning */}
						<button
							onClick={closeImagePopup}
							className="absolute -top-2 -right-2 z-50 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl border-2 border-white"
							aria-label="Close image"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						{/* Image Container */}
						<div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
							<img
								src={selectedImage.src}
								alt={selectedImage.alt}
								className="w-full h-auto max-h-[70vh] object-contain"
							/>
							{/* Image Info */}
							<div className="p-6">
								<h3 className="text-2xl font-bold text-gray-900 mb-2">
									{selectedImage.title}
								</h3>
								<p className="text-gray-600 text-lg leading-relaxed">
									{selectedImage.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default About;
