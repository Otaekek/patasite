import iconScenography from '../assets/gallery/logos/patasceno.jpg'
import iconSound from '../assets/gallery/logos/patasound.jpg'
import iconLight from '../assets/gallery/logos/patalight.jpg'
import iconMapping from '../assets/gallery/logos/patamapping.jpg'

// Auto-loads every photo dropped into src/assets/gallery/<section>/ - no
// code change needed to add/remove photos, just add files to the folder.
function loadSection(glob: Record<string, string>): string[] {
  return Object.keys(glob)
    .sort()
    .map((key) => glob[key])
}

const soundImages = loadSection(
  import.meta.glob('/src/assets/gallery/sound/*', { eager: true, import: 'default' }),
)
const lightImages = loadSection(
  import.meta.glob('/src/assets/gallery/light/*', { eager: true, import: 'default' }),
)
const scenographyImages = loadSection(
  import.meta.glob('/src/assets/gallery/scenography/*', { eager: true, import: 'default' }),
)
const mappingImages = loadSection(
  import.meta.glob('/src/assets/gallery/mapping/*', { eager: true, import: 'default' }),
)
export const titleImages = loadSection(
  import.meta.glob('/src/assets/gallery/title/*', { eager: true, import: 'default' }),
)

export interface GallerySection {
  id: string
  title: string
  description: string
  icon: string
  iconPosition?: string
  images: string[]
}

export const gallerySections: GallerySection[] = [
  {
    id: 'scenography',
    title: 'Scénographie',
    description:
      "Nous avons notre propre panoplie d'éléments visuels : dômes, méduses, lanternes, lights... Nous sommes habitués à changer régulièrement de scénographie en fonction des inspirations et de nos événements, nous pouvons déployer une très belle scène dans n'importe quel espace en toute autonomie.",
    icon: iconScenography,
    iconPosition: 'center 32%',
    images: scenographyImages,
  },
  {
    id: 'sound',
    title: 'Sound System',
    description:
      'Nous avons fabriqué notre système son à très haut rendement pouvant sonoriser des scènes jusqu’à 300-400 personnes. Il s’agit d’un système son de type Paraflex (sub et kick) avec des pavillons (aigu) que nous avons désigné. Nous pouvons régler le système son dans différente configuration (mono / stéréo / boiler) pour s’adapter au mieux au public et à la scénographie',
    icon: iconSound,
    images: soundImages,
  },
  // {
  //   id: 'light',
  //   title: 'Lumière',
  //   description:
  //     'Patatrack dispose de sa propre régie light avec ses lumières, lasers, et autres éléments de scénographie lumineux.',
  //   icon: iconLight,
  //   images: lightImages,
  // },
  {
    id: 'mapping',
    title: 'Mapping',
    description:
      'Patatrack a développé son propre logiciel de VJing audio-réactif, capable aussi bien de diffuser des visuels de toutes sortes, de faire du mapping, ou même de contrôler des lumières. Nous avons créé tous les visuels à la main, sans IA, et le logiciel nous permet de les combiner et de les modifier selon les besoins de la scénographie. Nous pouvons également créer des visuels personnalisés pour chaque événement.',
    icon: iconMapping,
    iconPosition: 'center 43%',
    images: mappingImages,
  },
]
