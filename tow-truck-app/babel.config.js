module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@/navigation': './src/navigation',
            '@/context': './src/context',
            '@/screens': './src/screens',
            '@/components': './src/components',
            '@/storage': './src/storage',
            '@/types': './src/types',
          },
        },
      ],
    ],
  };
};

