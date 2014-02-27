<?php

class Note extends Eloquent {

	protected $table = 'notes';
    protected $softDelete = true;

    public $timestamps = false;

	public function user()
	{
		return $this->belongsTo('User');
	}

}

?>