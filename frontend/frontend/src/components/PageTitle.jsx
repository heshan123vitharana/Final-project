import React from 'react';

const PageTitle = ({ 
  title, 
  subtitle, 
  description, 
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  descriptionClassName = "",
  centerAlign = true,
  showDecorator = true,
  decoratorColor = "emerald"
}) => {
  const alignmentClasses = centerAlign ? "text-center" : "text-left";
  
  const decoratorColors = {
    emerald: "from-emerald-500 to-green-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
    teal: "from-teal-500 to-emerald-500"
  };

  return (
    <div className={`relative py-16 px-4 ${className}`}>
      {/* Background with green transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className={`space-y-6 ${alignmentClasses}`}>
          
          {/* Decorative Element */}
          {showDecorator && (
            <div className={`flex ${centerAlign ? 'justify-center' : 'justify-start'}`}>
              <div className={`h-1 w-24 bg-gradient-to-r ${decoratorColors[decoratorColor]} rounded-full`}></div>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-emerald-600 professional-subtitle responsive-subtitle-text tracking-wide uppercase ${subtitleClassName}`}>
              {subtitle}
            </p>
          )}

          {/* Main Title */}
          <h1 className={`professional-title enhanced-text-display responsive-title-text font-bold text-gray-900 leading-normal tracking-tight ${titleClassName}`}>
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className={`professional-description enhanced-text-display responsive-description-text text-gray-600 max-w-3xl mx-auto leading-relaxed ${descriptionClassName}`}>
              {description}
            </p>
          )}

          {/* Bottom Decorative Line */}
          {showDecorator && (
            <div className={`flex ${centerAlign ? 'justify-center' : 'justify-start'} pt-4`}>
              <div className="flex items-center gap-2">
                <div className={`h-0.5 w-12 bg-gradient-to-r ${decoratorColors[decoratorColor]} rounded-full`}></div>
                <div className={`w-2 h-2 bg-gradient-to-r ${decoratorColors[decoratorColor]} rounded-full`}></div>
                <div className={`h-0.5 w-12 bg-gradient-to-r ${decoratorColors[decoratorColor]} rounded-full`}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
