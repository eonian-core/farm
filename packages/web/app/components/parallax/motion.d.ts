// framer-motion not export types...
// not be like they, export all types
// anyway, you can use it like `Motion.SpringOptions` type
declare namespace Motion {
  type SpringOptions = import('./framer-motion').SpringOptions;

  export { SpringOptions };
}
