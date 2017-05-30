<?php
namespace AppBundle\Storage;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Storage\AbstractStorage;
use Vich\UploaderBundle\Mapping\PropertyMappingFactory;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use \Cloudinary\Uploader;

/**
 * CloudinaryStorage.
 *
 * @author Emiliano Viada <emjovi@gmail.com>
 */
class CloudinaryStorage extends AbstractStorage
{
    /**
     * {@inheritdoc}
     */
    public function __construct(PropertyMappingFactory $factory)
    {
        parent::__construct($factory);

        $api_key = getenv('CLOUDINARY_API_KEY');
        $api_secret = getenv('CLOUDINARY_API_SECRET');
        \Cloudinary::config(array(
            "cloud_name" => "dq2ghwy1m",
            "api_key" => $api_key,
            "api_secret" => $api_secret
        ));
    }

    /**
     * {@inheritdoc}
     */
    protected function doUpload(PropertyMapping $mapping, UploadedFile $file, $dir, $name)
    {
        $id = null;
        $ext = $file->getClientOriginalExtension();
        $cdName = str_replace('.' . $ext, '', $name);
        $uploaded = Uploader::upload(
            $file->getPathname(),
            array('public_id' => $cdName)
        );
        if (is_array($uploaded) && isset($uploaded['public_id'])) {
            $id = $uploaded['public_id'];
        }

        return $id;
    }

    /**
     * {@inheritdoc}
     */
    protected function doRemove(PropertyMapping $mapping, $dir, $name)
    {
        $exists = $this->doResolvePath($mapping, $dir, $name);
        if ($exists) {
            $api = new \Cloudinary\Api();
            $api->delete_resources(array($name));
        }

        return;
    }

    /**
     * {@inheritdoc}
     */
    protected function doResolvePath(PropertyMapping $mapping, $dir, $name, $relative = false)
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function resolveUri($obj, $mappingName, $className = null)
    {
        $method = 'get' . ucfirst(str_replace('File', 'Uri', $mappingName));
        return $obj->$method();
        list($mapping, $name) = $this->getFilename($obj, $mappingName, $className);
        if (empty($name)) {
            return;
        }
        $uploadDir = $this->convertWindowsDirectorySeparator($mapping->getUploadDir($obj));
        $uploadDir = empty($uploadDir) ? '' : $uploadDir.'/';
        return sprintf('%s/%s', $mapping->getUriPrefix(), $uploadDir.$name);
    }

    /*private function convertWindowsDirectorySeparator($string)
    {
        return str_replace('\\', '/', $string);
    }*/
}
